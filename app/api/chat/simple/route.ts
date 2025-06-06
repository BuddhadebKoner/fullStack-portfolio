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
  if (/name|who are you/.test(m)) return ['profile'];
  if (/email|contact/.test(m)) return ['profile'];
  if (/phone|number/.test(m)) return ['profile'];
  if (/location|where.*live/.test(m)) return ['profile'];
  if (/skills|technologies|tech stack/.test(m)) return ['skills'];
  if (/projects|portfolio/.test(m)) return ['projects'];
  if (/experience|work|company|job/.test(m)) return ['workExperience'];
  if (/blog|article|post/.test(m)) return ['blogs'];
  return ['profile'];
}

// --- Direct Context Answer ---
import type { ChatContext } from '@/lib/services/contextService';

function directContextAnswer(msg: string, ctx: ChatContext): string | null {
  const m = msg.toLowerCase();
  if ((m === 'name' || m.includes('who are you')) && ctx.profile?.firstName && ctx.profile?.lastName) return `${ctx.profile.firstName} ${ctx.profile.lastName}`;
  if ((m.includes('email') || m.includes('contact')) && ctx.profile?.email) return ctx.profile.email;
  if ((m.includes('phone') || m.includes('number')) && ctx.profile?.phone) return ctx.profile.phone;
  if ((m.includes('location') || (m.includes('where') && m.includes('live'))) && (ctx.profile?.city || ctx.profile?.country)) return [ctx.profile.city, ctx.profile.country].filter(Boolean).join(', ');
  if ((m.includes('projects') && m.includes('list')) || m === 'projects') {
    if (ctx.projects && ctx.projects.length > 0) return ctx.projects.slice(0, 5).map((p, i) => `${i + 1}. ${p.title}`).join('. ');
  }
  if ((m.includes('skills') || m.includes('technologies') || m.includes('tech stack')) && ctx.skills && ctx.skills.length > 0) {
    const byLevel: Record<string, string[]> = {};
    ctx.skills.forEach((s) => { if (!byLevel[s.level]) byLevel[s.level] = []; byLevel[s.level].push(s.name); });
    return Object.entries(byLevel).map(([level, arr]) => `I'm ${level} in ${arr.join(', ')}`).join('. ');
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
    // AI fallback
    const ai = await getAIResponse({ message: v.sanitized, conversationHistory: limitedHistory, context: ctx });
    return NextResponse.json({ success: true, reply: ai.reply, processingTime: Date.now() - startTime });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
