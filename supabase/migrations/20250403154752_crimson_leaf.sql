/*
  # Create NFTs table

  1. New Tables
    - `nfts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (text)
      - `image` (text)
      - `creator_id` (uuid, references auth.users)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `nfts` table
    - Add policies for:
      - Anyone can view NFTs
      - Only authenticated users can create NFTs
      - Only creators can update their own NFTs
*/

CREATE TABLE IF NOT EXISTS nfts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  image text NOT NULL,
  creator_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read NFTs
CREATE POLICY "NFTs are viewable by everyone"
  ON nfts
  FOR SELECT
  USING (true);

-- Allow authenticated users to create NFTs
CREATE POLICY "Authenticated users can create NFTs"
  ON nfts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Allow users to update their own NFTs
CREATE POLICY "Users can update their own NFTs"
  ON nfts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);