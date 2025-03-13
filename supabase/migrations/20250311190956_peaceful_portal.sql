/*
  # Create properties table with policies

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `address` (text)
      - `realtor_name` (text)
      - `realtor_number` (text)
      - `asking_price` (numeric)
      - `purchase_price` (numeric)
      - `interest` (numeric)
      - `monthly_payment` (numeric)
      - `down_payment` (numeric)
      - `cash_flow` (numeric)
      - `cash_on_cash_return` (numeric)
      - `rent` (numeric)
      - `contacted` (boolean)
      - `notes` (text)
      - `image_url` (text)
      - `offer_status` (text)
      - `created_at` (timestamptz)
      - Additional fields for calculations
        - `monthly_insurance` (numeric)
        - `monthly_property_tax` (numeric)
        - `monthly_hoa` (numeric)
        - `monthly_other` (numeric)
        - `cap_ex_percentage` (numeric)
        - `management_percentage` (numeric)
        - `vacancy_percentage` (numeric)

  2. Security
    - Enable RLS on properties table
    - Add policies for authenticated users to:
      - Read their own properties
      - Create new properties
      - Update their own properties
      - Delete their own properties
*/

DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read own properties" ON properties;
  DROP POLICY IF EXISTS "Users can create properties" ON properties;
  DROP POLICY IF EXISTS "Users can update own properties" ON properties;
  DROP POLICY IF EXISTS "Users can delete own properties" ON properties;
END $$;

-- Create the properties table if it doesn't exist
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  address text NOT NULL,
  realtor_name text NOT NULL,
  realtor_number text NOT NULL,
  asking_price numeric NOT NULL DEFAULT 0,
  purchase_price numeric NOT NULL DEFAULT 0,
  interest numeric NOT NULL DEFAULT 0,
  monthly_payment numeric NOT NULL DEFAULT 0,
  down_payment numeric NOT NULL DEFAULT 0,
  cash_flow numeric NOT NULL DEFAULT 0,
  cash_on_cash_return numeric NOT NULL DEFAULT 0,
  rent numeric NOT NULL DEFAULT 0,
  contacted boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT '',
  image_url text,
  offer_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  monthly_insurance numeric NOT NULL DEFAULT 0,
  monthly_property_tax numeric NOT NULL DEFAULT 0,
  monthly_hoa numeric NOT NULL DEFAULT 0,
  monthly_other numeric NOT NULL DEFAULT 0,
  cap_ex_percentage numeric NOT NULL DEFAULT 10,
  management_percentage numeric NOT NULL DEFAULT 10,
  vacancy_percentage numeric NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);