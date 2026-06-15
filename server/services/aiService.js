const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

// Initialize API Clients conditionally
let genAI = null;
let openai = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Unified core caller for AI services.
 * Integrates fallbacks and handles provider choice.
 */
async function callAI(prompt, systemInstruction = "You are GradForge AI, an expert academic and technical mentor.") {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  // Try selected provider first
  if (provider === 'openai' && openai) {
    return await callOpenAI(prompt, systemInstruction);
  } else if (genAI) {
    return await callGemini(prompt, systemInstruction);
  }

  // Fallbacks if primary provider isn't initialized
  if (openai) {
    console.log('[AI Service] Primary provider failed or not configured, falling back to OpenAI.');
    return await callOpenAI(prompt, systemInstruction);
  } else if (genAI) {
    console.log('[AI Service] Primary provider failed or not configured, falling back to Gemini.');
    return await callGemini(prompt, systemInstruction);
  }

  // If no API keys are configured, return high-quality mock data
  console.warn('[AI Service WARNING] No AI keys configured. Running in Mock Mode.');
  return getMockResponse(prompt);
}

async function callGemini(prompt, systemInstruction) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    // If OpenAI client exists, fallback inside error handler
    if (openai) {
      console.log('Attempting emergency fallback to OpenAI...');
      return await callOpenAI(prompt, systemInstruction);
    }
    throw error;
  }
}

async function callOpenAI(prompt, systemInstruction) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    if (genAI) {
      console.log('Attempting emergency fallback to Gemini...');
      return await callGemini(prompt, systemInstruction);
    }
    throw error;
  }
}

// Generates high quality structural mock data when offline/no keys
function getMockResponse(prompt) {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('project idea') || lower.includes('ideas')) {
    return JSON.stringify([
      {
        title: "AI-Powered Smart Resume Analyser",
        description: "An ATS-friendly parser that uses NLP to suggest changes and improvements for student CVs.",
        techStack: ["React", "Express", "Node", "MongoDB", "Python NLP"]
      },
      {
        title: "Decentralized E-Voting System",
        description: "A blockchain-secured portal that guarantees tamperproof voter validation and quick tallies.",
        techStack: ["React", "Solidity", "Ether.js", "Express", "MongoDB"]
      },
      {
        title: "IoT Smart Crop Health Monitor",
        description: "Deep learning classification of crop leaves coupled with soil metrics and climate stats.",
        techStack: ["React Native", "Flask", "TensorFlow", "IoT ESP32"]
      }
    ]);
  }

  if (lower.includes('roadmap') || lower.includes('project details')) {
    return JSON.stringify({
      title: "Generated Project Concept",
      description: "A detailed design concept created by GradForge mock AI engine.",
      techStack: ["React.js", "Express.js", "Tailwind CSS", "MongoDB"],
      roadmap: [
        "Phase 1: Architecture design & setup Mongoose schemas.",
        "Phase 2: Build REST endpoints and write auth middleware.",
        "Phase 3: Code frontend pages and test API integrations.",
        "Phase 4: Integrate AI assistants and run manual tests.",
        "Phase 5: Deploy to production (Render/Vercel)."
      ],
      databaseSchema: "User {\n  name: String,\n  email: String (unique),\n  role: String\n}\n\nProject {\n  userId: ObjectId,\n  title: String,\n  category: String\n}",
      architecture: "Client (React + Vite) <---> API Gateway (Express Routing) <---> Business Logic Controllers <---> Mongoose Driver <---> MongoDB Database Cluster",
      starterTemplateUrl: "https://github.com/gradforge/project-starter-template",
      deploymentGuide: "1. Push code to GitHub.\n2. Configure environment values (MONGO_URI, JWT_SECRET).\n3. Hook server repository to Render.js.\n4. Build static directory for client folder."
    });
  }

  if (lower.includes('assignment')) {
    return `### Assignment Output\n\n**Topic:** Analysis of modern computing systems.\n\n**Introduction:** Modern computing architectures rely heavily on unified data flow patterns. This paper examines typical patterns, bottlenecks, and optimizations.\n\n**Key Elements:**\n1. Centralized storage frameworks\n2. Distributed queue management\n3. Edge-node computing clusters\n\n**Conclusion:** System integration requires cohesive modular design. By scaling databases horizontally, we prevent network-edge bandwidth congestion.`;
  }

  if (lower.includes('viva questions')) {
    return JSON.stringify([
      { question: "What is the primary role of the virtual DOM in React?", correctAnswer: "It allows React to perform efficient UI updates by comparing a virtual representation with the real DOM." },
      { question: "How does JWT handle user sessions securely?", correctAnswer: "It signs token contents using a cryptographic secret key, letting the backend verify authenticity without storing state." },
      { question: "What is the benefit of indexing in MongoDB?", correctAnswer: "It speeds up search queries significantly at the cost of slight overhead on inserts/updates." }
    ]);
  }

  if (lower.includes('evaluate') || lower.includes('correctanswer')) {
    return JSON.stringify({
      score: 8,
      feedback: "Great answer! You correctly identified the core purpose. To get full marks, elaborate more on diffing algorithms.",
      isCorrect: true
    });
  }

  return "This is a fallback response from the GradForge AI services layer. Please configure GEMINI_API_KEY or OPENAI_API_KEY in the backend .env file to enable full real AI functionality.";
}

// Service exports
module.exports = {
  callAI,
  
  generateProjectIdeas: async (category, keywords = '') => {
    const prompt = `Generate 3 project ideas in the category: '${category}' based on the keywords: '${keywords}'. Return output ONLY as a valid JSON array of objects. Each object must have fields 'title', 'description', and 'techStack' (array of strings). Do not include markdown code block tags like \`\`\`json.`;
    const response = await callAI(prompt, "You are a senior project supervisor. Return only valid JSON.");
    try {
      return JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      return JSON.parse(getMockResponse('project ideas'));
    }
  },

  generateProjectDetails: async (title, category) => {
    const prompt = `Create project details for: Title: '${title}', Category: '${category}'. Return output ONLY as a valid JSON object with the following fields:
    - 'title' (string)
    - 'description' (string)
    - 'techStack' (array of strings)
    - 'roadmap' (array of strings representing stages of development)
    - 'databaseSchema' (string describing models/schemas)
    - 'architecture' (string describing architectural diagram)
    - 'starterTemplateUrl' (string URL to github/zip starter pack)
    - 'deploymentGuide' (string guide on deployment steps)
    Do not include markdown code blocks.`;
    const response = await callAI(prompt, "You are a software architect. Return only valid JSON.");
    try {
      return JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      return JSON.parse(getMockResponse('project details'));
    }
  },

  generateAssignment: async (topic, wordCount = 500, formatting = 'academic') => {
    const prompt = `Write a comprehensive, professional assignment on the topic: '${topic}'. Word count goal: ${wordCount} words. Formatting style: '${formatting}'. Provide sections with headings, clear explanations, and references.`;
    return await callAI(prompt, "You are a college professor. Write a structured academic assignment.");
  },

  generateDocSection: async (title, sectionName) => {
    const prompt = `Generate the '${sectionName}' section for the project report titled: '${title}'. Ensure it is formal, comprehensive, and follows typical university thesis guidelines.`;
    return await callAI(prompt, "You are an academic researcher writing a final year thesis report.");
  },

  generateVivaQuestions: async (title, description) => {
    const prompt = `Based on the project title: '${title}' and description: '${description}', generate 3 challenging viva-voce questions that an examiner might ask. Return output ONLY as a JSON array of objects, where each object has:
    - 'question' (string)
    - 'correctAnswer' (string, a concise correct answer for grading)
    Do not include markdown code blocks.`;
    const response = await callAI(prompt, "You are a university external examiner. Return only valid JSON.");
    try {
      return JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      return JSON.parse(getMockResponse('viva questions'));
    }
  },

  evaluateVivaAnswer: async (question, studentAnswer, correctAnswer) => {
    const prompt = `Evaluate the student's answer for the following question.
    Question: "${question}"
    Expected Correct Answer: "${correctAnswer}"
    Student's Answer: "${studentAnswer}"
    
    Evaluate accuracy. Return output ONLY as a JSON object:
    {
      "score": (integer out of 10),
      "feedback": (string detailing what was right/wrong and how to improve),
      "isCorrect": (boolean indicating if the answer is mostly correct)
    }
    Do not include markdown code blocks.`;
    const response = await callAI(prompt, "You are an examiner grading oral tests. Return only valid JSON.");
    try {
      return JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      return JSON.parse(getMockResponse('evaluate'));
    }
  },

  chatAssistant: async (messages, currentContext = '') => {
    const sysPrompt = `You are the GradForge AI Mentor. You help students with project implementation, code design, career choices, portfolio creation, and resume improvement. Keep responses structured, encouraging, and highly technical. Context of current workspace page: ${currentContext}`;
    
    // Parse conversation array for OpenAI or standard prompts
    const promptText = messages.map(m => `${m.sender === 'user' ? 'Student' : 'Mentor'}: ${m.text}`).join('\n') + '\nMentor:';
    return await callAI(promptText, sysPrompt);
  }
};
