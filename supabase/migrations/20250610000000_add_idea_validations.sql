-- Create idea_validations table for AI-powered analysis results
CREATE TABLE IF NOT EXISTS idea_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  swot_analysis JSONB,
  user_personas JSONB,
  market_analysis JSONB,
  investor_readiness_score DECIMAL,
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE idea_validations ENABLE ROW LEVEL SECURITY;

-- Creators can read their own idea validations
CREATE POLICY "Creators can read their own idea validations"
  ON idea_validations
  FOR SELECT
  USING (
    idea_id IN (
      SELECT id FROM ideas WHERE creator_id = auth.uid()
    )
  );

-- Creators can create validations for their own ideas
CREATE POLICY "Creators can create validations for their own ideas"
  ON idea_validations
  FOR INSERT
  WITH CHECK (
    idea_id IN (
      SELECT id FROM ideas WHERE creator_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_idea_validations_updated_at
  BEFORE UPDATE ON idea_validations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
