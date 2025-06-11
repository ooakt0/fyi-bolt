import { mockValidationResponse } from '../data/mockData';
import { supabase } from '../store/authStore/supabaseClient';
import { IdeaData, IdeaValidation } from '../types';
import { generateChatResponse } from './chatgpt';

// Parse the response as JSON to match the IdeaValidation type
export async function validateIdeaWithAI(ideaData: IdeaData): Promise<IdeaValidation> {
  // Construct a detailed prompt for the AI analysis
  const prompt = `Please analyze this business idea and provide a comprehensive evaluation:

Title: ${ideaData.title}
Description: ${ideaData.description}
About: ${ideaData.aboutThisIdea}
Key Features: ${ideaData.keyFeatures}
Market Opportunity: ${ideaData.marketOpportunity}
Category: ${ideaData.category}
Funding Goal: $${ideaData.fundingGoal}

Perform a detailed analysis and provide:
1. SWOT Analysis
2. User Personas
3. Market Analysis
4. Investment Readiness Score (0-100)
5. Strategic Recommendations

Format the response as a JSON object with these exact keys:
{
  "swot_analysis": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
  "user_personas": [{ "name": "", "age": "", "occupation": "", "goals": [], "pain_points": [], "motivations": [] }],
  "market_analysis": { "market_size": "", "target_segments": [], "competition": [], "opportunities": [], "risks": [] },
  "investor_readiness_score": 0,
  "recommendations": []
}`;
  try {
    const response: IdeaValidation = mockValidationResponse; // Replace with actual API call when ready
    return response;
  } catch (error) {
    console.error('Error validating idea with AI:', error);
    throw error;
  }
}

export async function saveValidationResults(ideaId: string, validation: IdeaValidation): Promise<void> {
  const { error } = await supabase.from('idea_validations').insert([
    {
      idea_id: ideaId,
      swot_analysis: validation.swot_analysis,
      user_personas: validation.user_personas,
      market_analysis: validation.market_analysis,
      investor_readiness_score: validation.investor_readiness_score,
      recommendations: validation.recommendations,
    }
  ]);

  if (error) throw error;
}
