import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Profile, Project, Skill, WorkExperience, Blog, IProfile, IProject, ISkill, IWorkExperience, IBlog } from '@/models';

// Type definitions
interface ConversationMessage {
  text: string;
  isUser: boolean;
}

interface RequestBody {
  message: string;
  conversationHistory?: ConversationMessage[];
}

interface CacheData {
  data: unknown;
  expiry: number;
}

interface ContextData {
  profile?: IProfile | null;
  skills?: ISkill[];
  projects?: IProject[];
  workExperience?: IWorkExperience[];
  blogs?: IBlog[];
}

interface SkillsByLevel {
  [level: string]: string[];
}

interface SkillsByCategory {
  [category: string]: string[];
}

interface DatabaseResult {
  type: string;
  data: unknown;
}

interface ErrorResponse {
  success: boolean;
  reply: string;
  error: boolean;
}

interface GenerateContentResult {
  response: {
    text(): string;
  };
}

// Rate limiting and security
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_MESSAGE_LENGTH = 500;
const MAX_CONVERSATION_HISTORY = 10;

// In-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

// Input validation and sanitization
function validateAndSanitizeInput(message: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!message || typeof message !== 'string') {
    return { isValid: false, sanitized: '', error: 'Message must be a string' };
  }
  
  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { isValid: false, sanitized: '', error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` };
  }
  
  // Remove potentially harmful content
  const sanitized = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>]/g, ''); // Remove angle brackets
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\b(eval|exec|system|shell_exec)\b/i,
    /\b(drop|delete|truncate|alter)\s+table\b/i,
    /\bunion\s+select\b/i,
    /\bscript\b/i,
    /<iframe/i,
    /data:text\/html/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return { isValid: false, sanitized: '', error: 'Message contains suspicious content' };
    }
  }
  
  return { isValid: true, sanitized };
}

// Database query functions with error handling and caching
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const dataCache = new Map<string, CacheData>();

function getCachedData(key: string): unknown | null {
  const cached = dataCache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  dataCache.delete(key);
  return null;
}

function setCachedData(key: string, data: unknown): void {
  dataCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

async function getProfileData(): Promise<IProfile | null> {
  const cacheKey = 'profile';
  const cached = getCachedData(cacheKey);
  if (cached) return cached as IProfile;
  
  try {
    await connectToDatabase();
    const data = await Profile.findOne().lean() as IProfile | null;
    if (data) setCachedData(cacheKey, data);
    return data;
  } catch {
    console.error('Error fetching profile data');
    return null;
  }
}

async function getSkillsData(category?: string): Promise<ISkill[]> {
  const cacheKey = `skills_${category || 'all'}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached as ISkill[];
  
  try {
    await connectToDatabase();
    const query: Record<string, unknown> = { isVisible: true };
    if (category) {
      query.category = category;
    }
    const data = await Skill.find(query).sort({ order: 1 }).lean();
    setCachedData(cacheKey, data);
    return data as unknown as ISkill[];
  } catch {
    console.error('Error fetching skills data');
    return [];
  }
}

async function getProjectsData(featured?: boolean): Promise<IProject[]> {
  const cacheKey = `projects_${featured ? 'featured' : 'all'}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached as IProject[];
  
  try {
    await connectToDatabase();
    const query: Record<string, unknown> = { isPublished: true };
    if (featured) {
      query.featured = true;
    }
    const data = await Project.find(query).sort({ order: 1 }).lean();
    setCachedData(cacheKey, data);
    return data as unknown as IProject[];
  } catch {
    console.error('Error fetching projects data');
    return [];
  }
}

async function getWorkExperienceData(): Promise<IWorkExperience[]> {
  const cacheKey = 'workExperience';
  const cached = getCachedData(cacheKey);
  if (cached) return cached as IWorkExperience[];
  
  try {
    await connectToDatabase();
    const data = await WorkExperience.find({ isVisible: true }).sort({ order: 1 }).lean();
    setCachedData(cacheKey, data);
    return data as unknown as IWorkExperience[];
  } catch {
    console.error('Error fetching work experience data');
    return [];
  }
}

async function getBlogsData(): Promise<IBlog[]> {
  const cacheKey = 'blogs';
  const cached = getCachedData(cacheKey);
  if (cached) return cached as IBlog[];
  
  try {
    await connectToDatabase();
    const data = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
    setCachedData(cacheKey, data);
    return data as unknown as IBlog[];
  } catch {
    console.error('Error fetching blogs data');
    return [];
  }
}

// Enhanced question analysis function
function analyzeQuestion(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Quick direct responses for simple questions
  const quickResponses: { [key: string]: string } = {
    'what is your name': 'profile',
    'who are you': 'profile',
    'what skills do you have': 'skills',
    'what technologies do you know': 'skills',
    'what projects have you built': 'projects',
    'show me your projects': 'projects',
    'what is your experience': 'experience',
    'where have you worked': 'experience',
    'what is your email': 'profile',
    'how to contact you': 'profile',
    'tell me about yourself': 'profile'
  };

  // Check for exact quick responses first
  if (quickResponses[lowerMessage]) {
    return [quickResponses[lowerMessage]];
  }
  
  const categories = {
    profile: ['about', 'who are you', 'bio', 'background', 'name', 'contact', 'email', 'phone', 'location', 'social', 'yourself'],
    skills: ['skills', 'technologies', 'programming', 'languages', 'frameworks', 'tools', 'expertise', 'tech stack', 'know', 'proficient', 'good at'],
    projects: ['projects', 'work', 'portfolio', 'apps', 'websites', 'applications', 'development', 'built', 'created', 'made', 'developed'],
    experience: ['experience', 'job', 'career', 'position', 'company', 'worked', 'employment', 'role', 'professional', 'workplace'],
    blogs: ['blog', 'articles', 'writing', 'posts', 'content', 'published', 'written']
  };

  const detected = [];
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detected.push(category);
    }
  }

  return detected.length > 0 ? detected : ['profile']; // Default to profile
}

// Enhanced response cleaning
function cleanResponse(text: string): string {
  if (!text) return '';
  
  let cleaned = text.trim();
  
  // Remove unwanted phrases (more comprehensive list)
  const unwantedPhrases = [
    /^hi there!?\s*/i,
    /^hello!?\s*/i,
    /^hey!?\s*/i,
    /^greetings!?\s*/i,
    /^good\s+(morning|afternoon|evening)!?\s*/i,
    /my database shows?\s*/i,
    /according to my (data|database|information|records)\s*/i,
    /based on my (data|database|information|records)\s*/i,
    /let me tell you\s*/i,
    /i can tell you that\s*/i,
    /here's what i (have|know|can tell you)\s*/i,
    /from my (database|records)[,:]\s*/i,
    /my records show\s*/i,
    /in my (database|records)[,:]\s*/i,
    /as per my (data|database|information)\s*/i,
    /looking at my (data|database|information)\s*/i,
    /from what i (can see|know)\s*/i,
    /well,?\s*/i,
    /so,?\s*/i,
    /actually,?\s*/i,
    /basically,?\s*/i,
    /essentially,?\s*/i,
    /to answer your question,?\s*/i,
    /in response to your query,?\s*/i
  ];

  unwantedPhrases.forEach(phrase => {
    cleaned = cleaned.replace(phrase, '');
  });

  // Clean up punctuation and formatting
  cleaned = cleaned.replace(/^[,.:;!?\-\s]+/, ''); // Remove leading punctuation
  cleaned = cleaned.replace(/\s+/g, ' '); // Normalize spaces
  cleaned = cleaned.trim();
  
  // Capitalize first letter if needed
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body: RequestBody;
    try {
      body = await request.json() as RequestBody;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { message, conversationHistory = [] } = body;

    // Validate and sanitize input
    const validation = validateAndSanitizeInput(message);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const sanitizedMessage = validation.sanitized;

    // Validate conversation history
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid conversation history format' },
        { status: 400 }
      );
    }

    // Limit conversation history size
    const limitedHistory = conversationHistory
      .slice(-MAX_CONVERSATION_HISTORY)
      .filter((msg: ConversationMessage) => msg && typeof msg.text === 'string' && msg.text.trim().length > 0);

    // Analyze the question to determine what data to fetch
    const questionCategories = analyzeQuestion(sanitizedMessage);

    // Fetch relevant data from database with timeout
    const contextData: ContextData = {};
    
    try {
      const dbPromises = [];
      
      if (questionCategories.includes('profile')) {
        dbPromises.push(getProfileData().then(data => ({ type: 'profile', data })));
      }
      
      if (questionCategories.includes('skills')) {
        dbPromises.push(getSkillsData().then(data => ({ type: 'skills', data })));
      }
      
      if (questionCategories.includes('projects')) {
        dbPromises.push(getProjectsData().then(data => ({ type: 'projects', data })));
      }
      
      if (questionCategories.includes('experience')) {
        dbPromises.push(getWorkExperienceData().then(data => ({ type: 'workExperience', data })));
      }
      
      if (questionCategories.includes('blogs')) {
        dbPromises.push(getBlogsData().then(data => ({ type: 'blogs', data })));
      }

      // Wait for all database queries with timeout
      const dbTimeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      );

      const results = await Promise.race([
        Promise.all(dbPromises),
        dbTimeout
      ]) as DatabaseResult[];

      results.forEach(result => {
        (contextData as Record<string, unknown>)[result.type] = result.data;
      });

    } catch (dbError) {
      console.error('Database fetch error:', dbError);
      // If database fails, provide fallback response
      return NextResponse.json({
        success: true,
        reply: "I'm experiencing technical difficulties accessing my information. Please try again in a moment or contact me directly."
      });
    }

    // Enhanced direct response handling
    const lowerMessage = sanitizedMessage.toLowerCase().trim();
    
    // Direct database responses for specific questions (no AI needed)
    if (lowerMessage.includes('what skills') || lowerMessage.includes('technologies') || lowerMessage.includes('tech stack')) {
      if (contextData.skills && contextData.skills.length > 0) {
        const skillsByLevel = contextData.skills.reduce((acc: SkillsByLevel, skill: ISkill) => {
          if (!acc[skill.level]) acc[skill.level] = [];
          acc[skill.level].push(skill.name);
          return acc;
        }, {});
        
        let skillsResponse = '';
        const levelOrder = ['expert', 'advanced', 'intermediate', 'beginner'];
        
        levelOrder.forEach(level => {
          if (skillsByLevel[level] && skillsByLevel[level].length > 0) {
            const skills = skillsByLevel[level].join(', ');
            if (skillsResponse) skillsResponse += '. ';
            skillsResponse += `I'm ${level} in ${skills}`;
          }
        });
        
        return NextResponse.json({
          success: true,
          reply: skillsResponse || 'Skills information not available'
        });
      }
    }

    if (lowerMessage === 'name' || lowerMessage === 'what is your name' || lowerMessage.includes('who are you')) {
      if (contextData.profile?.firstName && contextData.profile?.lastName) {
        return NextResponse.json({
          success: true,
          reply: `${contextData.profile.firstName} ${contextData.profile.lastName}`
        });
      }
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      if (contextData.profile?.email) {
        return NextResponse.json({
          success: true,
          reply: contextData.profile.email
        });
      }
    }

    if (lowerMessage.includes('phone') || lowerMessage.includes('number')) {
      if (contextData.profile?.phone) {
        return NextResponse.json({
          success: true,
          reply: contextData.profile.phone
        });
      }
    }

    if (lowerMessage.includes('location') || lowerMessage.includes('where') && lowerMessage.includes('live')) {
      if (contextData.profile?.city || contextData.profile?.country) {
        const location = [contextData.profile.city, contextData.profile.country].filter(Boolean).join(', ');
        return NextResponse.json({
          success: true,
          reply: location || 'Location not available'
        });
      }
    }

    if ((lowerMessage.includes('projects') && lowerMessage.includes('list')) || lowerMessage === 'projects') {
      if (contextData.projects && contextData.projects.length > 0) {
        const projectsList = contextData.projects.slice(0, 5).map((project: IProject, index: number) => 
          `${index + 1}. ${project.title}`
        ).join('. ');
        
        return NextResponse.json({
          success: true,
          reply: projectsList
        });
      }
    }

    // Check if Gemini API key is available
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_GEMINI_API_KEY not found in environment variables');
      
      // Provide intelligent database-based fallback
      if (contextData.profile) {
        const profile = contextData.profile;
        const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
        const contact = profile.email ? ` Contact: ${profile.email}` : '';
        
        return NextResponse.json({
          success: true,
          reply: `I'm ${name || 'Buddhadeb Koner'}, a full-stack developer. My AI assistant is temporarily unavailable.${contact} Feel free to reach out directly!`
        });
      }
      
      return NextResponse.json({
        success: true,
        reply: "I'm Buddhadeb Koner, a full-stack developer. My AI assistant is temporarily unavailable. Please reach out directly!"
      });
    }

    // Enhanced AI Integration with timeout and retry logic
    try {
      const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = await import('@google/generative-ai');
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.0,
          topP: 0.1,
          topK: 1,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Build conversation context with sanitization
      let conversationContext = '';
      if (limitedHistory && limitedHistory.length > 0) {
        conversationContext = '\n\nConversation History:\n';
        limitedHistory.forEach((msg: ConversationMessage) => {
          const role = msg.isUser ? 'User' : 'Buddhadeb';
          const sanitizedText = msg.text.substring(0, 200); // Limit message length
          conversationContext += `${role}: ${sanitizedText}\n`;
        });
      }

      // Build comprehensive database context
      let databaseContext = '\n\nSTRICT DATABASE INFORMATION:\n';
      
      if (contextData.profile) {
        const profile = contextData.profile;
        databaseContext += `PROFILE:
- Name: ${profile.firstName} ${profile.lastName}
- Email: ${profile.email || 'Not provided'}
- Phone: ${profile.phone || 'Not provided'}
- Location: ${profile.city ? `${profile.city}, ${profile.country}` : profile.country || 'Not provided'}
- Bio: ${profile.bio || 'Not provided'}
- Social Links: ${Object.entries(profile.socialLinks || {}).map(([platform, url]) => url ? `${platform}: ${url}` : '').filter(Boolean).join(', ') || 'Not provided'}

`;
      }

      if (contextData.skills && contextData.skills.length > 0) {
        databaseContext += `SKILLS:\n`;
        const skillsByCategory = contextData.skills.reduce((acc: SkillsByCategory, skill: ISkill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(`${skill.name} (${skill.level})`);
          return acc;
        }, {});
        
        Object.entries(skillsByCategory).forEach(([category, skills]) => {
          databaseContext += `- ${category.toUpperCase()}: ${(skills as string[]).join(', ')}\n`;
        });
        databaseContext += '\n';
      }

      if (contextData.projects && contextData.projects.length > 0) {
        databaseContext += `PROJECTS:\n`;
        contextData.projects.slice(0, 3).forEach((project: IProject, index: number) => {
          databaseContext += `${index + 1}. ${project.title}
   Description: ${project.desc}
   Technologies: ${project.technologies.join(', ')}
   ${project.liveUrl ? `Live URL: ${project.liveUrl}` : ''}
   ${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''}
   Featured: ${project.featured ? 'Yes' : 'No'}

`;
        });
      }

      if (contextData.workExperience && contextData.workExperience.length > 0) {
        databaseContext += `WORK EXPERIENCE:\n`;
        contextData.workExperience.slice(0, 3).forEach((exp: IWorkExperience, index: number) => {
          const endDate = exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : 'Not specified';
          databaseContext += `${index + 1}. ${exp.position} at ${exp.company}
   Duration: ${new Date(exp.startDate).getFullYear()} - ${endDate}
   Technologies: ${exp.technologies.join(', ')}
   ${exp.description ? `Description: ${exp.description.substring(0, 200)}` : ''}

`;
        });
      }

      if (contextData.blogs && contextData.blogs.length > 0) {
        databaseContext += `BLOG POSTS:\n`;
        contextData.blogs.slice(0, 3).forEach((blog: IBlog, index: number) => {
          databaseContext += `${index + 1}. ${blog.title}
   Description: ${blog.desc}
   Tags: ${blog.tags.join(', ')}
   Views: ${blog.views}, Likes: ${blog.likes}

`;
        });
      }

      // Enhanced AI personality with strict rules
      const personality = `You are Buddhadeb Koner, a full-stack developer. CRITICAL RULES:

1. ONLY use information from the "STRICT DATABASE INFORMATION" section
2. NEVER add conversational phrases like "Hi!", "Hello!", "My database shows", etc.
3. NEVER provide information not explicitly in the database
4. Give direct, factual responses only
5. Use first person ("I am", "I have", "I worked at")
6. Maximum 50 words per response
7. If information is missing from database, say "Information not available"
8. NO greetings, NO pleasantries, NO assumptions
9. Focus ONLY on factual data from database
10. NEVER mention "database", "according to", "based on" in responses

EXAMPLES:
Good: "I'm expert in React, advanced in TypeScript"
Bad: "Hi! According to my database, I'm expert in React..."

Good: "Buddhadeb Koner"
Bad: "Hello! I'm Buddhadeb Koner, nice to meet you!"`;

      const prompt = `${personality}

${databaseContext}
${conversationContext}

User Question: ${sanitizedMessage}

Direct factual answer (max 50 words):`;

      // AI request with timeout
      const aiTimeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('AI timeout')), 10000)
      );
      
      const aiRequest = model.generateContent(prompt);
      
      const result = await Promise.race([aiRequest, aiTimeout]) as GenerateContentResult;
      const response = result.response;
      let text = response.text().trim();

      // Enhanced response cleaning
      text = cleanResponse(text);

      // Validate response length and content
      if (!text || text.length === 0) {
        throw new Error('Empty AI response');
      }

      if (text.length > 200) {
        text = text.substring(0, 200).trim();
        // Ensure we end at a complete word
        const lastSpace = text.lastIndexOf(' ');
        if (lastSpace > 100) {
          text = text.substring(0, lastSpace);
        }
      }

      // Final security check - ensure no sensitive information leakage
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /token/i,
        /api[_\s]?key/i,
        /private[_\s]?key/i
      ];

      for (const pattern of sensitivePatterns) {
        if (pattern.test(text)) {
          text = 'Information not available';
          break;
        }
      }

      return NextResponse.json({
        success: true,
        reply: text,
        processingTime: Date.now() - startTime
      });

    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Intelligent fallback based on available data
      let fallbackResponse = "I'm experiencing technical difficulties. ";
      
      if (contextData.profile?.email) {
        fallbackResponse += `Please contact me at ${contextData.profile.email}`;
      } else {
        fallbackResponse += "Please try again in a moment.";
      }
      
      return NextResponse.json({
        success: true,
        reply: fallbackResponse
      });
    }

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('Chat API critical error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      processingTime,
      timestamp: new Date().toISOString(),
      ip: getRateLimitKey(request)
    });

    // Determine appropriate error response based on error type
    const errorResponse: ErrorResponse = {
      success: true, // Always return success to avoid exposing internal errors
      reply: '',
      error: false
    };

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
        errorResponse.reply = "I'm taking a bit longer to respond than usual. Please try again.";
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        errorResponse.reply = "I'm having connectivity issues. Please try again in a moment.";
      } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
        errorResponse.reply = "I'm currently busy helping others. Please try again in a few minutes.";
      } else {
        // Generic technical error
        errorResponse.reply = "I'm experiencing technical difficulties. Please try again or contact me directly.";
      }
    } else {
      // Unknown error type
      errorResponse.reply = "Something unexpected happened. Please try again.";
    }

    // Add helpful contact information if available
    try {
      const profileData = await getProfileData();
      if (profileData?.email) {
        errorResponse.reply += ` You can also reach me at ${profileData.email}`;
      }
    } catch {
      // Ignore profile fetch errors in error handler
    }

    return NextResponse.json(errorResponse, { 
      status: 200, // Always return 200 to avoid client-side error handling
      headers: {
        'X-Processing-Time': processingTime.toString(),
        'X-Error-Handled': 'true'
      }
    });
  }
}

// Cleanup function for rate limiting map (run periodically)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
