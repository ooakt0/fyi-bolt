import Ajv from 'ajv';
import { mockValidationResponse } from '../data/mockData';
import { supabase } from '../store/authStore/supabaseClient';
import { IdeaData, IdeaValidation } from '../types';
import { generateChatResponse } from './chatgpt';

const ajv = new Ajv();

// Define the JSON schema for validation
const ideaValidationSchema = {
  type: 'object',
  properties: {
    swot_analysis: {
      type: 'object',
      properties: {
        strengths: { type: 'array', items: { type: 'string' } },
        weaknesses: { type: 'array', items: { type: 'string' } },
        opportunities: { type: 'array', items: { type: 'string' } },
        threats: { type: 'array', items: { type: 'string' } },
      },
      required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
    },
    user_personas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'string' },
          occupation: { type: 'string' },
          goals: { type: 'array', items: { type: 'string' } },
          pain_points: { type: 'array', items: { type: 'string' } },
          motivations: { type: 'array', items: { type: 'string' } },
        },
        required: ['name', 'age', 'occupation', 'goals', 'pain_points', 'motivations'],
      },
    },
    market_analysis: {
      type: 'object',
      properties: {
        market_size: { type: 'string' },
        target_segments: { type: 'array', items: { type: 'string' } },
        competition: { type: 'array', items: { type: 'string' } },
        opportunities: { type: 'array', items: { type: 'string' } },
        risks: { type: 'array', items: { type: 'string' } },
      },
      required: ['market_size', 'target_segments', 'competition', 'opportunities', 'risks'],
    },
    investor_readiness_score: { type: 'number' },
    recommendations: { type: 'array', items: { type: 'string' } },
  },
  required: ['swot_analysis', 'user_personas', 'market_analysis', 'investor_readiness_score', 'recommendations'],
};

// Parse the response as JSON to match the IdeaValidation type
export async function validateIdeaWithAI(ideaData: IdeaData & { id: string }): Promise<IdeaValidation> {
  // Check if validation already exists in the database
  const { data: existingValidation, error: fetchError } = await supabase
    .from('idea_validations')
    .select('*')
    .eq('idea_id', ideaData.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "no rows found" error
    console.error('Error fetching existing validation:', fetchError);
    throw fetchError;
  }

  if (existingValidation) {
    console.log('Using existing validation from database:', existingValidation);
    return existingValidation as IdeaValidation;
  }

  // If no existing validation, proceed with AI call
  try {
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

    const aiResponse = await generateChatResponse(prompt, { isAuthenticated: true, userRole: undefined });
    console.log('Raw AI Response:', aiResponse);

    try {
      const parsedResponse = JSON.parse(aiResponse);

      // Validate the parsed response against the schema
      const validate = ajv.compile(ideaValidationSchema);
      if (!validate(parsedResponse)) {
        console.error('AI response validation failed:', validate.errors);
        throw new Error('AI response does not match the expected schema');
      }

      return parsedResponse as IdeaValidation;
    } catch (error) {
      console.error('Error parsing or validating AI response:', error, 'Response:', aiResponse);
      throw new Error('Invalid AI response format');
    }
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
