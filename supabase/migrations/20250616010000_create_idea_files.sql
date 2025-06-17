-- Drop existing idea_files table if it exists
DROP TABLE IF EXISTS idea_files CASCADE;
DROP TYPE IF EXISTS file_type CASCADE;

-- Create enum for file types
CREATE TYPE file_type AS ENUM (
  'validation_report',
  'pitch_deck',
  'video',
  'ai_image',
  'market_research',
  'user_upload'
);

-- Create idea_files table
CREATE TABLE idea_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_type file_type NOT NULL,
  storage_provider TEXT NOT NULL DEFAULT 'aws',
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_idea_files_idea_id ON idea_files(idea_id);
CREATE INDEX idx_idea_files_file_type ON idea_files(file_type);
CREATE INDEX idx_idea_files_uploaded_at ON idea_files(uploaded_at DESC);

-- Add RLS policies
ALTER TABLE idea_files ENABLE ROW LEVEL SECURITY;

-- Allow users to view files of ideas they have access to
CREATE POLICY "Users can view idea files they have access to"
ON idea_files FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_files.idea_id
    AND (
      -- Creator can view their own idea files
      ideas."creatorId" = auth.uid()
      OR
      -- Public files can be viewed by anyone
      NOT idea_files.is_private
      OR
      -- If user is an investor, they can view all files
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'investor'
      )
    )
  )
);

-- Allow creators to manage their own idea files
CREATE POLICY "Creators can insert their own idea files"
ON idea_files FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_id
    AND ideas."creatorId" = auth.uid()
  )
);

CREATE POLICY "Creators can update their own idea files"
ON idea_files FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_files.idea_id
    AND ideas."creatorId" = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_files.idea_id
    AND ideas."creatorId" = auth.uid()
  )
);

CREATE POLICY "Creators can delete their own idea files"
ON idea_files FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_files.idea_id
    AND ideas."creatorId" = auth.uid()
  )
);

-- Create function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_idea_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER set_idea_files_timestamp
  BEFORE UPDATE ON idea_files
  FOR EACH ROW
  EXECUTE FUNCTION update_idea_files_updated_at();

-- Create function to handle file deletion
CREATE OR REPLACE FUNCTION handle_idea_file_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- This function will be triggered when a file is deleted
  -- Implement S3 file deletion logic in n8n
  RETURN OLD;
END;
$$ language 'plpgsql';

-- Create trigger for file deletion
CREATE TRIGGER before_idea_file_deletion
  BEFORE DELETE ON idea_files
  FOR EACH ROW
  EXECUTE FUNCTION handle_idea_file_deletion();
