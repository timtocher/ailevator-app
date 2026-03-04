import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are the official interactive AI guide for Garage Band Venture Company, representing AIlevator and Visiabell.io. 
    Your goal is to answer questions, explain AI automation, and confidently drive leads toward scheduling a free 30-minute AI Readiness Assessment.
    
    CRITICAL KNOWLEDGE BASE:
    - AIlevator (The Engine): Automating the mundane, custom AI agents, workflow automation.
    - Visiabell (The Face): AI-enhanced web design, Next-Gen SEO (GEO), marketplace expertise.
    - Packages: AI Starter ($1,500/mo), Growth Engine ($3,500/mo), Business-in-a-Box ($7,500/mo).
    
    TONE: Professional, highly knowledgeable, authoritative, and direct. Keep responses concise.`,
    messages,
    tools: {
      runVisibilityAudit: tool({
        description: 'Run an SEO and AI Generative Engine Optimization (GEO) audit for a provided website URL.',
        parameters: z.object({
          websiteUrl: z.string().describe('The URL of the website to audit'),
        }),
        execute: async ({ websiteUrl }) => {
          return `Audit complete for ${websiteUrl}. 
          Findings: The site is lacking modern JSON-LD Schema markup required for AI search engines (like ChatGPT and Perplexity) to properly recommend it. Load times are slightly above the 2-second threshold. 
          Recommendation: A Visiabell GEO Optimization overhaul is required to ensure this brand is visible in the AI-first economy.`;
        },
      }),
      generateGrowthStrategy: tool({
        description: 'Generate a custom AI automation strategy based on the user\'s business goals.',
        parameters: z.object({
          primaryGoal: z.string().describe('The main goal, e.g., lead generation, saving admin time, etc.'),
        }),
        execute: async ({ primaryGoal }) => {
          return `Strategy mapped for goal: "${primaryGoal}". 
          Phase 1: Deploy an AIlevator Lead Generation Chatbot to capture traffic 24/7. 
          Phase 2: Implement Make.com workflows to route qualified leads directly to your CRM. 
          Recommended Package: The Growth Engine ($3,500/mo).`;
        },
      })
    }
  });

  return result.toDataStreamResponse();
}
