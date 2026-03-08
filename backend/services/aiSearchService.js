const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

class AISearchService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  GEMINI_API_KEY not set — AI search will be unavailable, falling back to keyword search.');
      this.model = null;
      return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
    this.permitCache = null;
    this.cacheTimestamp = null;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }

  get isAvailable() {
    return this.model !== null;
  }

  /**
   * Load all permits from DB and cache them so we don't hit DB on every query.
   */
  async getPermitCatalog() {
    const now = Date.now();
    if (this.permitCache && this.cacheTimestamp && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.permitCache;
    }

    const permits = await prisma.torontoPermit.findMany({
      orderBy: { id: 'asc' },
    });

    this.permitCache = permits;
    this.cacheTimestamp = now;
    return permits;
  }

  /**
   * Build a compact permit catalog string for the LLM prompt.
   * Format: "ID | Name | Category | Description (truncated)"
   */
  buildPermitCatalogText(permits) {
    return permits.map(p => {
      const desc = p.description.length > 120
        ? p.description.substring(0, 120) + '...'
        : p.description;
      return `${p.id} | ${p.name} | ${p.category} | ${desc}`;
    }).join('\n');
  }

  /**
   * AI-powered permit search using Gemini.
   * Sends the user's natural language query + permit catalog to Gemini,
   * which returns the most relevant permit IDs with reasoning.
   */
  async searchPermits(query, limit = 5) {
    if (!this.isAvailable) {
      throw new Error('AI search unavailable — GEMINI_API_KEY not configured');
    }

    console.log(`🤖 AI Search for: "${query}"`);

    const permits = await this.getPermitCatalog();
    const catalogText = this.buildPermitCatalogText(permits);

    const prompt = `You are a Toronto permit expert assistant. A user is describing their project or situation, and you need to identify which Toronto city permits, licences, or registrations they would need.

PERMIT CATALOG (format: ID | Name | Category | Short Description):
${catalogText}

USER QUERY: "${query}"

INSTRUCTIONS:
1. Understand the user's INTENT — what are they trying to do? Think about ALL permits they might need, even ones they didn't explicitly mention.
2. For example, if someone says "I want to open a restaurant", they'd need permits for the food establishment, possibly a patio permit, sign permits, building permits if renovating, etc.
3. Return the ${limit} most relevant permits from the catalog above.
4. For each permit, provide a brief reason explaining WHY this permit is relevant to the user's query.

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code fences, just raw JSON):
{
  "intent": "brief summary of what the user wants to do",
  "permits": [
    {
      "id": <permit ID number from catalog>,
      "reason": "1 sentence why this permit is needed",
      "relevanceScore": <number 1-100, how relevant this permit is>
    }
  ]
}

IMPORTANT: Only return permits that genuinely apply. If fewer than ${limit} permits are relevant, return fewer. The "id" must exactly match an ID from the catalog. Return ONLY valid JSON, nothing else.`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const parsed = this._parseJsonResponse(responseText);
      
      if (!parsed.permits || !Array.isArray(parsed.permits)) {
        throw new Error('Invalid AI response structure');
      }

      // Map AI results back to full permit records from DB
      const permitMap = new Map(permits.map(p => [p.id, p]));
      
      const results = parsed.permits
        .filter(aiPermit => permitMap.has(aiPermit.id))
        .map(aiPermit => {
          const fullPermit = permitMap.get(aiPermit.id);
          return {
            ...fullPermit,
            relevanceScore: aiPermit.relevanceScore || 50,
            aiReason: aiPermit.reason || '',
          };
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

      console.log(`🤖 AI found ${results.length} permits (intent: "${parsed.intent}")`);

      return {
        permits: results,
        intent: parsed.intent || '',
        aiPowered: true,
      };
    } catch (error) {
      console.error('🤖 AI search error:', error.message);
      throw error;
    }
  }

  /**
   * Conversational permit search — takes chat history and returns a friendly
   * message + relevant permits. Supports follow-up refinements.
   */
  async chatSearch(messages, limit = 8) {
    if (!this.isAvailable) {
      throw new Error('AI search unavailable — GEMINI_API_KEY not configured');
    }

    const permits = await this.getPermitCatalog();
    const catalogText = this.buildPermitCatalogText(permits);

    // Build conversation context from message history
    const conversationLines = messages.map(m => {
      const role = m.role === 'user' ? 'USER' : 'ASSISTANT';
      return `${role}: ${m.content}`;
    }).join('\n');

    const latestUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    console.log(`🤖 AI Chat for: "${latestUserMsg}"`);

    const prompt = `You are Permit Genie, a friendly and knowledgeable Toronto permit assistant. You help people figure out exactly which permits, licences, or registrations they need for their projects.

PERMIT CATALOG (format: ID | Name | Category | Short Description):
${catalogText}

CONVERSATION SO FAR:
${conversationLines}

INSTRUCTIONS:
1. Read the full conversation to understand what the user is trying to do and any refinements they've made.
2. Respond with a friendly, helpful message (2-4 sentences) that:
   - Acknowledges what they want to do
   - Briefly explains why you're recommending these specific permits
   - If this is a follow-up, acknowledge the new info and explain how it changes recommendations
   - Invite them to share more details if needed
3. Select the most relevant permits from the catalog. Think about ALL permits they might need, even ones they didn't mention.
4. If the user says some permits aren't relevant, adjust your recommendations accordingly.
5. If the user provides more details, refine and improve your suggestions.

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code fences, just raw JSON):
{
  "message": "Your friendly conversational response here",
  "permits": [
    {
      "id": <permit ID number from catalog>,
      "reason": "1 sentence why this permit is needed for their specific situation",
      "relevanceScore": <number 1-100>
    }
  ]
}

IMPORTANT:
- The "message" should feel natural and conversational, like talking to a helpful expert friend
- Don't just list permits in the message — give context and be helpful
- Only return permits that genuinely apply
- The "id" must exactly match an ID from the catalog
- Return ONLY valid JSON, nothing else
- Maximum ${limit} permits`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const parsed = this._parseJsonResponse(responseText);

      if (!parsed.message || !parsed.permits || !Array.isArray(parsed.permits)) {
        throw new Error('Invalid AI chat response structure');
      }

      const permitMap = new Map(permits.map(p => [p.id, p]));

      const results = parsed.permits
        .filter(aiPermit => permitMap.has(aiPermit.id))
        .map(aiPermit => {
          const fullPermit = permitMap.get(aiPermit.id);
          return {
            ...fullPermit,
            relevanceScore: aiPermit.relevanceScore || 50,
            aiReason: aiPermit.reason || '',
          };
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

      console.log(`🤖 AI Chat returned ${results.length} permits`);

      return {
        message: parsed.message,
        permits: results,
        aiPowered: true,
      };
    } catch (error) {
      console.error('🤖 AI chat error:', error.message);
      throw error;
    }
  }

  /**
   * Robustly extract JSON from AI response text.
   * Handles: raw JSON, code-fenced JSON, JSON embedded in conversational text.
   */
  _parseJsonResponse(text) {
    // 1. Try direct parse first
    try {
      return JSON.parse(text);
    } catch (_) {}

    // 2. Strip markdown code fences
    let cleaned = text.replace(/^```(?:json)?\s*/gm, '').replace(/\s*```$/gm, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (_) {}

    // 3. Find JSON object in the text using brace matching
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch (_) {}
    }

    throw new Error(`Could not extract JSON from AI response: ${text.substring(0, 100)}...`);
  }
}

module.exports = AISearchService;
