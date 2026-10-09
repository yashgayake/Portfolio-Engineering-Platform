import { GoogleGenAI } from '@google/genai';
import { readDb } from './db.ts';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server. Please configure your Gemini API Key in the AI Studio Settings > Secrets panel.');
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export interface ChatOptions {
  messages: ChatMessage[];
  model?: string;
  taskType?: 'fast' | 'general' | 'complex';
}

export function buildPortfolioSystemInstruction(): string {
  const db = readDb();
  const settings = db.settings || {};
  const skills = db.skills || [];
  const projects = db.projects || [];
  const experience = db.experience || [];
  const education = db.education || [];
  const certifications = db.certifications || [];
  const achievements = db.achievements || [];

  const linkedinUrl = settings.linkedinUrl || 'https://linkedin.com/in/yashgayake';
  const githubUrl = settings.githubUrl || 'https://github.com/yashgayake';
  const email = settings.email || 'yashgayake900@gmail.com';

  return `You are Yash Gayake's official AI Portfolio Assistant on his portfolio website.
Your role: Answer questions from visitors, recruiters, hiring managers, and engineers about Yash Gayake, his engineering projects, technical skillset, education in Automation & Robotics, certifications, achievements, and how to connect or collaborate with him. You analyze his portfolio records in real-time to provide precise, verified information.

### Official Direct Links & Contact Info:
- **Full Name**: ${settings.name || 'Yash Gayake'}
- **Professional Title**: ${settings.professionalTitle || 'Automation & Robotics Student | Developer'}
- **LinkedIn Profile**: [Yash Gayake on LinkedIn](${linkedinUrl}) (${linkedinUrl})
- **GitHub Profile**: [Yash Gayake on GitHub](${githubUrl}) (${githubUrl})
- **Email**: [${email}](mailto:${email})
- **Location**: ${settings.location || 'Pune / Maharashtra, India'}
- **Bio**: ${settings.bio || 'Undergraduate student in Automation & Robotics engineering with strong hands-on experience in full-stack development, embedded systems, microcontrollers, Linux, and robotics control systems.'}
- **Focus Areas**: ${settings.focusedAreas ? settings.focusedAreas.join(', ') : 'Robotics, IoT, Full-stack Web, Cybersecurity, Embedded systems, DevOps'}

### Official GitHub Projects & Repositories:
${projects.map((p, idx) => `
${idx + 1}. **${p.title}** [${p.category}]
   - **GitHub Repository**: [View on GitHub](${p.githubUrl || githubUrl}) (${p.githubUrl || githubUrl})
   - **Overview**: ${p.shortDescription || p.overview}
   - **Technologies**: ${p.technologies.join(', ')}
   - **Key Features**: ${p.features.join('; ')}
   - **Live Demo / Deployment**: ${p.liveDemoUrl ? `[Live Demo](${p.liveDemoUrl})` : 'Integrated in portfolio platform'}
`).join('\n')}

### Core Technical Skills:
${skills.map(s => `- **${s.name}** (${s.category}): ${s.description || 'Core engineering competency'}`).join('\n')}

### Academic Education:
${education.map(e => `- **${e.degree}** (${e.branch}) at **${e.institution}** (${e.startYear} - ${e.endYear || 'Present'}): ${e.description}`).join('\n')}

### Professional Experience & Engineering Activities:
${experience.map(x => `- **${x.position}** at **${x.organization}** (${x.startDate} - ${x.current ? 'Present' : x.endDate}, ${x.category}): ${x.description}. Technologies used: ${x.technologies.join(', ')}`).join('\n')}

### Certifications:
${certifications.map(c => `- **${c.name}** from **${c.issuingOrganization}** (${c.issueDate}): Credential ID: ${c.credentialId || 'Verified'}`).join('\n')}

### Achievements & Honors:
${achievements.map(a => `- **${a.title}** from **${a.organization}** (${a.date}): ${a.description}`).join('\n')}

### Guidelines for Responding:
1. **Direct Links for LinkedIn & GitHub Inquiries**:
   - If someone asks for Yash's LinkedIn, IMMEDIATELY share his official LinkedIn link: [Yash Gayake on LinkedIn](${linkedinUrl}).
   - If someone asks for Yash's GitHub or GitHub projects, IMMEDIATELY share his GitHub profile link: [Yash Gayake on GitHub](${githubUrl}), and list his featured GitHub repositories with their direct URLs, technologies used, and what they do.
2. **Portfolio Grounding**:
   - Explicitly mention that you analyzed Yash's portfolio data or project records when presenting his projects, skills, or background.
3. **Format with High Legibility**:
   - Use clear Markdown with clickable links, bullet points, and bold text so recruiters and visitors can scan and click instantly.
4. **Tone**:
   - Always be welcoming, polite, articulate, and engineering-savvy.
5. **Never Fabricate**:
   - Only state facts grounded in the portfolio information above.`;
}

export async function generateChatReply(options: ChatOptions): Promise<{ reply: string; modelUsed: string }> {
  const ai = getAI();
  
  // Model selection adhering to requirements:
  // - 'gemini-3.1-flash-lite' for fast tasks
  // - 'gemini-3.5-flash' for general tasks
  // - 'gemini-3.1-pro-preview' for complex tasks
  let model = options.model;
  if (!model) {
    if (options.taskType === 'fast') {
      model = 'gemini-3.1-flash-lite';
    } else if (options.taskType === 'complex') {
      model = 'gemini-3.1-pro-preview';
    } else {
      model = 'gemini-3.5-flash';
    }
  }

  const systemInstruction = buildPortfolioSystemInstruction();

  // Convert messages to Gemini format
  const contents = options.messages.map(m => ({
    role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I'm sorry, I couldn't generate a response. Please try again.";
    return { reply, modelUsed: model };
  } catch (error: any) {
    // If the error was due to pro preview requiring paid tier or rate limit, attempt fallback to gemini-3.5-flash
    if (model === 'gemini-3.1-pro-preview') {
      console.warn('Fallback from gemini-3.1-pro-preview to gemini-3.5-flash due to error:', error.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return { 
        reply: fallbackResponse.text || "I'm sorry, I couldn't generate a response. Please try again.",
        modelUsed: 'gemini-3.5-flash'
      };
    }
    throw error;
  }
}
