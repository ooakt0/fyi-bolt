/*
  # Create payment_links table

  1. New Tables
    - `payment_links`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas table)
      - `idea_name` (text)
      - `payment_provider` (text)
      - `payment_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payment_links` table
    - Add policies for authenticated users to read active payment links
*/

CREATE TABLE IF NOT EXISTS payment_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  idea_name text NOT NULL,
  payment_provider text NOT NULL,
  payment_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active payment links"
  ON payment_links
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all payment links"
  ON payment_links
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS payment_links_idea_id_index ON payment_links (idea_id);
CREATE INDEX IF NOT EXISTS payment_links_active_index ON payment_links (is_active);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_payment_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_links_updated_at
  BEFORE UPDATE ON payment_links
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_links_updated_at();