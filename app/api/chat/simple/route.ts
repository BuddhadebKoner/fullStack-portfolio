import { NextRequest, NextResponse } from 'next/server';
import { getChatContext } from '@/lib/services/contextService';
import { getAIResponse } from '@/lib/services/aiService';

// --- Types ---
interface ConversationMessage {
  text: string;
  isUser: boolean;
}
interface RequestBody {
  message: string;
  conversationHistory?: ConversationMessage[];
}

// --- Config ---
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_MESSAGE_LENGTH = 500;
const MAX_CONVERSATION_HISTORY = 10;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// --- Rate Limiting ---
function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
}
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return true;
  record.count++;
  return false;
}
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) rateLimitMap.delete(key);
  }
}, 5 * 60 * 1000);

// --- Input Validation ---
function validateInput(message: string): { valid: boolean; sanitized: string; error?: string } {
  if (!message || typeof message !== 'string') return { valid: false, sanitized: '', error: 'Message must be a string' };
  const trimmed = message.trim();
  if (!trimmed) return { valid: false, sanitized: '', error: 'Message cannot be empty' };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { valid: false, sanitized: '', error: `Message too long (max ${MAX_MESSAGE_LENGTH})` };
  // Basic sanitization
  const sanitized = trimmed.replace(/<script.*?>.*?<\/script>/gi, '').replace(/[<>]/g, '');
  return { valid: true, sanitized };
}

// --- Question Category Analysis ---
function analyzeCategory(msg: string): string[] {
  const m = msg.toLowerCase();
  const categories: string[] = [];
  
  // Profile related
  if (/name|who are you|about you|introduce/.test(m)) categories.push('profile');
  if (/email|contact|reach out|get in touch/.test(m)) categories.push('profile');
  if (/phone|number|call/.test(m)) categories.push('profile');
  if (/location|where.*live|based|from/.test(m)) categories.push('profile');
  
  // Skills and technologies
  if (/skills|technologies|tech stack|programming|languages|frameworks|tools/.test(m)) categories.push('skills');
  if (/experience.*with|know.*about|familiar.*with|work.*with/.test(m)) categories.push('skills');
  if (/docker|kubernetes|react|node|python|javascript|typescript|mongodb|sql/.test(m)) categories.push('skills');
  
  // Projects
  if (/projects|portfolio|built|created|developed|work/.test(m)) categories.push('projects');
  if (/github|code|repository|demo|live|website/.test(m)) categories.push('projects');
  
  // Work experience
  if (/experience|work|company|job|career|employed|position/.test(m)) categories.push('workExperience');
  
  // Blogs
  if (/blog|article|post|write|writing|recent.*blog|latest.*blog/.test(m)) categories.push('blogs');
  
  return categories.length > 0 ? categories : ['profile'];
}

// --- Direct Context Answer ---
import type { ChatContext } from '@/lib/services/contextService';

// --- Direct Context Answer ---
function directContextAnswer(msg: string, ctx: ChatContext): string | null {
  const m = msg.toLowerCase().trim();
  
  // Greeting responses
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/i.test(m)) {
    const name = ctx.profile?.firstName ? ctx.profile.firstName : 'there';
    return `Hello! I'm ${name}, a full-stack developer. How can I help you today?`;
  }
  
  // Basic questions
  if (/^(how are you|how's it going)$/i.test(m)) {
    return "I'm doing great! I'm passionate about coding and always excited to discuss technology and my projects.";
  }
  
  if (/^(what do you do|what's your job|what do you work as)$/i.test(m)) {
    return "I'm a full-stack developer specializing in modern web technologies. I build web applications, work with databases, and create user-friendly interfaces.";
  }
  
  // Basic info
  if (/(^name$|who are you|what.*your name)/i.test(m) && ctx.profile?.firstName && ctx.profile?.lastName) {
    return `I'm ${ctx.profile.firstName} ${ctx.profile.lastName}, a full-stack developer.`;
  }
  
  if (/(email|contact.*info|how.*contact|reach out)/i.test(m) && ctx.profile?.email) {
    return `You can reach me at ${ctx.profile.email}`;
  }
  
  if (/(phone|number|call)/i.test(m) && ctx.profile?.phone) {
    return `You can call me at ${ctx.profile.phone}`;
  }
  
  if (/(location|where.*live|where.*based|where.*from)/i.test(m) && (ctx.profile?.city || ctx.profile?.country)) {
    return `I'm based in ${[ctx.profile.city, ctx.profile.country].filter(Boolean).join(', ')}`;
  }
  
  // Skills and experience questions
  if (/(do you know|experience.*with|familiar.*with|work.*with|skills.*in).*docker/i.test(m)) {
    const dockerSkill = ctx.skills?.find(s => s.name.toLowerCase().includes('docker'));
    if (dockerSkill) {
      return `Yes, I have ${dockerSkill.level} experience with Docker. I use it for containerization and deployment.`;
    }
    return "I have experience with Docker for containerizing applications and managing development environments.";
  }
  
  if (/(do you know|experience.*with|familiar.*with|work.*with|skills.*in).*(react|reactjs)/i.test(m)) {
    const reactSkill = ctx.skills?.find(s => s.name.toLowerCase().includes('react'));
    if (reactSkill) {
      return `Yes, I'm ${reactSkill.level} with React. I use it for building modern user interfaces and web applications.`;
    }
    return "Yes, I work extensively with React for building dynamic and interactive user interfaces.";
  }
  
  if (/(do you know|experience.*with|familiar.*with|work.*with|skills.*in).*(node|nodejs|node\.js)/i.test(m)) {
    const nodeSkill = ctx.skills?.find(s => s.name.toLowerCase().includes('node'));
    if (nodeSkill) {
      return `Yes, I'm ${nodeSkill.level} with Node.js. I use it for backend development and API creation.`;
    }
    return "Yes, I work with Node.js for server-side development and building APIs.";
  }
  
  if (/(do you know|experience.*with|familiar.*with|work.*with|skills.*in).*(python)/i.test(m)) {
    const pythonSkill = ctx.skills?.find(s => s.name.toLowerCase().includes('python'));
    if (pythonSkill) {
      return `Yes, I have ${pythonSkill.level} experience with Python. I use it for various projects and automation.`;
    }
    return "I have experience with Python for development and scripting tasks.";
  }
  
  // Skills listing
  if (/(skills|technologies|tech stack|what.*you.*know)/i.test(m) && ctx.skills && ctx.skills.length > 0) {
    const byLevel: Record<string, string[]> = {};
    ctx.skills.forEach((s) => { 
      if (!byLevel[s.level]) byLevel[s.level] = []; 
      byLevel[s.level].push(s.name); 
    });
    
    const skillsText = Object.entries(byLevel)
      .map(([level, skills]) => `${level}: ${skills.join(', ')}`)
      .join('. ');
    
    return `My technical skills include: ${skillsText}`;
  }
  
  // Projects
  if (/(projects|what.*built|portfolio|show.*work|your.*work)/i.test(m) && ctx.projects && ctx.projects.length > 0) {
    if (ctx.projects.length <= 3) {
      return ctx.projects.map((p, i) => `${i + 1}. ${p.title} - ${p.desc}`).join('. ');
    } else {
      const topProjects = ctx.projects.slice(0, 3);
      return `Here are some of my key projects: ${topProjects.map((p, i) => `${i + 1}. ${p.title}`).join(', ')}. I have ${ctx.projects.length} total projects in my portfolio.`;
    }
  }
  
  if (/(github|code|repository|source)/i.test(m) && ctx.projects && ctx.projects.length > 0) {
    const projectsWithGithub = ctx.projects.filter(p => p.githubUrl);
    if (projectsWithGithub.length > 0) {
      return `You can check out my code on GitHub. Some projects: ${projectsWithGithub.slice(0, 2).map(p => `${p.title} (${p.githubUrl})`).join(', ')}`;
    }
    return "I have several projects on GitHub. You can find links in my portfolio section.";
  }
  
  if (/(live.*demo|demo|website|live.*link)/i.test(m) && ctx.projects && ctx.projects.length > 0) {
    const projectsWithDemo = ctx.projects.filter(p => p.liveUrl);
    if (projectsWithDemo.length > 0) {
      return `Here are some live demos: ${projectsWithDemo.slice(0, 2).map(p => `${p.title} (${p.liveUrl})`).join(', ')}`;
    }
    return "I have several live projects. Check my portfolio for demo links.";
  }
  
  // Blogs
  if (/(recent.*blog|latest.*blog|blog.*post|article)/i.test(m) && ctx.blogs && ctx.blogs.length > 0) {
    const latestBlog = ctx.blogs[0]; // Already sorted by latest
    return `My latest blog post is "${latestBlog.title}" - ${latestBlog.desc}. Check it out at /blog/${latestBlog.slug}`;
  }
  
  if (/(blog|blogs|writing|articles)/i.test(m) && ctx.blogs && ctx.blogs.length > 0) {
    if (ctx.blogs.length === 1) {
      return `I have written 1 blog post: "${ctx.blogs[0].title}". You can read it at /blog/${ctx.blogs[0].slug}`;
    } else {
      const recent = ctx.blogs.slice(0, 2);
      return `I've written ${ctx.blogs.length} blog posts. Recent ones: ${recent.map(b => `"${b.title}" (/blog/${b.slug})`).join(', ')}`;
    }
  }
  
  // Work experience
  if (/(work.*experience|career|job|company|employed)/i.test(m) && ctx.workExperience && ctx.workExperience.length > 0) {
    const current = ctx.workExperience.find(w => w.isCurrent);
    if (current) {
      return `I'm currently working as ${current.position} at ${current.company}. ${current.description ? current.description.substring(0, 100) + '...' : ''}`;
    } else {
      const latest = ctx.workExperience[0];
      return `My most recent role was ${latest.position} at ${latest.company}. ${latest.description ? latest.description.substring(0, 100) + '...' : ''}`;
    }
  }
  
  // Thank you responses
  if (/(thank you|thanks|appreciate)/i.test(m)) {
    return "You're welcome! Feel free to ask me anything else about my work or experience.";
  }
  
  // Goodbye responses
  if (/(bye|goodbye|see you|talk.*later|take care)/i.test(m)) {
    return "Thanks for chatting! Feel free to reach out anytime. Have a great day!";
  }
  
  return null;
}

// --- Intelligent Response Handler ---
function getIntelligentResponse(msg: string, ctx: ChatContext): string | null {
  const m = msg.toLowerCase().trim();
  
  // Technology-specific experience questions
  const techPatterns = [
    { regex: /(experience|work|familiar).*with.*(docker|containerization)/i, tech: 'docker' },
    { regex: /(experience|work|familiar).*with.*(kubernetes|k8s)/i, tech: 'kubernetes' },
    { regex: /(experience|work|familiar).*with.*(react|reactjs)/i, tech: 'react' },
    { regex: /(experience|work|familiar).*with.*(node|nodejs)/i, tech: 'node' },
    { regex: /(experience|work|familiar).*with.*(python)/i, tech: 'python' },
    { regex: /(experience|work|familiar).*with.*(mongodb|mongo)/i, tech: 'mongodb' },
    { regex: /(experience|work|familiar).*with.*(sql|mysql|postgresql)/i, tech: 'sql' },
    { regex: /(experience|work|familiar).*with.*(aws|cloud)/i, tech: 'aws' },
    { regex: /(experience|work|familiar).*with.*(typescript|ts)/i, tech: 'typescript' },
    { regex: /(experience|work|familiar).*with.*(next|nextjs)/i, tech: 'next' },
  ];
  
  for (const pattern of techPatterns) {
    if (pattern.regex.test(m)) {
      const skill = ctx.skills?.find(s => s.name.toLowerCase().includes(pattern.tech));
      if (skill) {
        return `Yes, I have ${skill.level} experience with ${skill.name}. I've used it in several projects and it's part of my regular tech stack.`;
      } else {
        // Check if mentioned in projects
        const projectsWithTech = ctx.projects?.filter(p => 
          p.technologies?.some(t => t.toLowerCase().includes(pattern.tech))
        );
        if (projectsWithTech && projectsWithTech.length > 0) {
          return `Yes, I've worked with ${pattern.tech} in projects like ${projectsWithTech[0].title}. It's a technology I'm comfortable using.`;
        }
        return `I have some experience with ${pattern.tech}, though it's not currently listed as one of my primary skills.`;
      }
    }
  }
  
  // Project-specific questions
  if (/(latest|recent|newest).*project/i.test(m) && ctx.projects && ctx.projects.length > 0) {
    const latest = ctx.projects[0]; // Assuming sorted by recent
    let response = `My latest project is "${latest.title}" - ${latest.desc}`;
    if (latest.technologies?.length) {
      response += ` Built with ${latest.technologies.join(', ')}.`;
    }
    if (latest.liveUrl) {
      response += ` You can check it out live at ${latest.liveUrl}`;
    }
    if (latest.githubUrl) {
      response += ` or view the code at ${latest.githubUrl}`;
    }
    return response;
  }
  
  if (/(featured|best|top).*project/i.test(m) && ctx.projects && ctx.projects.length > 0) {
    const featured = ctx.projects.find(p => p.featured);
    if (featured) {
      let response = `My featured project is "${featured.title}" - ${featured.desc}`;
      if (featured.liveUrl) response += ` Check it out at ${featured.liveUrl}`;
      return response;
    }
  }
  
  // Category-specific project questions
  const categoryMap: Record<string, string> = {
    'web': 'web development',
    'mobile': 'mobile app',
    'ai': 'AI/ML',
    'tool': 'development tool',
    'desktop': 'desktop application'
  };
  
  for (const [category, description] of Object.entries(categoryMap)) {
    if (new RegExp(`${category}.*project|project.*${category}`, 'i').test(m)) {
      const categoryProjects = ctx.projects?.filter(p => p.category === category);
      if (categoryProjects && categoryProjects.length > 0) {
        const project = categoryProjects[0];
        return `I have ${categoryProjects.length} ${description} project${categoryProjects.length > 1 ? 's' : ''}. "${project.title}" is one of them - ${project.desc}`;
      }
    }
  }
  
  // Blog-related questions
  if (/(how.*many.*blog|number.*blog|total.*blog)/i.test(m) && ctx.blogs) {
    return `I've written ${ctx.blogs.length} blog post${ctx.blogs.length !== 1 ? 's' : ''} covering various tech topics.`;
  }
  
  if (/(blog.*about|write.*about|topic.*blog)/i.test(m) && ctx.blogs && ctx.blogs.length > 0) {
    const topics = new Set<string>();
    ctx.blogs.forEach(b => b.tags?.forEach(tag => topics.add(tag)));
    if (topics.size > 0) {
      return `I write about ${Array.from(topics).slice(0, 5).join(', ')} and other tech topics. My latest post is "${ctx.blogs[0].title}".`;
    }
  }
  
  // Career and experience questions
  if (/(how.*long.*experience|years.*experience|experience.*years)/i.test(m) && ctx.workExperience && ctx.workExperience.length > 0) {
    // Calculate total experience (simplified)
    const totalYears = ctx.workExperience.length * 1.5; // Rough estimate
    return `I have approximately ${Math.round(totalYears)} years of professional experience in software development across various roles and technologies.`;
  }
  
  if (/(current.*role|current.*job|currently.*work)/i.test(m) && ctx.workExperience && ctx.workExperience.length > 0) {
    const current = ctx.workExperience.find(w => w.isCurrent);
    if (current) {
      return `I'm currently working as ${current.position} at ${current.company}. ${current.description ? current.description.substring(0, 100) + '...' : ''}`;
    } else {
      return "I'm currently open to new opportunities and working on personal projects to enhance my skills.";
    }
  }
  
  // Learning and goals questions
  if (/(learning|studying|working.*on|current.*focus)/i.test(m)) {
    const recentTechs = ctx.skills?.filter(s => s.level === 'intermediate' || s.level === 'beginner');
    if (recentTechs && recentTechs.length > 0) {
      return `I'm continuously learning and improving my skills. Currently focusing on ${recentTechs.slice(0, 3).map(s => s.name).join(', ')} and exploring new technologies.`;
    }
    return "I'm always learning new technologies and improving my existing skills. I believe in continuous growth in this ever-evolving field.";
  }
  
  // Collaboration questions
  if (/(hire|available|freelance|work.*together|collaborate)/i.test(m)) {
    const email = ctx.profile?.email;
    return `I'm open to discussing new opportunities and collaborations. ${email ? `Feel free to reach out to me at ${email}` : 'You can contact me through the contact information on my portfolio'} to discuss your project needs.`;
  }
  
  return null;
}

// --- Main Handler ---
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    // Rate limit
    const key = getRateLimitKey(request);
    if (isRateLimited(key)) return NextResponse.json({ success: false, error: 'Too many requests.' }, { status: 429 });
    // Parse body
    let body: RequestBody;
    try { body = await request.json(); } catch { return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 }); }
    const { message, conversationHistory = [] } = body;
    // Validate
    const v = validateInput(message);
    if (!v.valid) return NextResponse.json({ success: false, error: v.error }, { status: 400 });
    if (!Array.isArray(conversationHistory)) return NextResponse.json({ success: false, error: 'Invalid conversation history' }, { status: 400 });
    const limitedHistory = conversationHistory.slice(-MAX_CONVERSATION_HISTORY).filter(m => m && typeof m.text === 'string' && m.text.trim());
    // Analyze and fetch context
    const cats = analyzeCategory(v.sanitized);
    const ctx = await getChatContext({
      includeProfile: cats.includes('profile'),
      includeSkills: cats.includes('skills'),
      includeProjects: cats.includes('projects'),
      includeWorkExperience: cats.includes('workExperience'),
      includeBlogs: cats.includes('blogs'),
    });
    // Direct answer if possible
    const direct = directContextAnswer(v.sanitized, ctx);
    if (direct) return NextResponse.json({ success: true, reply: direct });
    // Intelligent response handler
    const intelligent = getIntelligentResponse(v.sanitized, ctx);
    if (intelligent) return NextResponse.json({ success: true, reply: intelligent });
    // AI fallback
    const ai = await getAIResponse({ message: v.sanitized, conversationHistory: limitedHistory, context: ctx });
    return NextResponse.json({ success: true, reply: ai.reply, processingTime: Date.now() - startTime });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
