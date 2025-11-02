-- =====================================================
-- NNN Tracker Database Schema
-- =====================================================


DROP TABLE IF EXISTS tracker_data;
DROP TABLE IF EXISTS user_profiles;

-- 1. Create user_profiles table for storing usernames
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- 2. Create or update tracker_data table
CREATE TABLE IF NOT EXISTS tracker_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  failed_days INTEGER[] DEFAULT '{}',
  current_day INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_data ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view all profiles for leaderboard" ON user_profiles;

DROP POLICY IF EXISTS "Users can view their own tracker data" ON tracker_data;
DROP POLICY IF EXISTS "Users can insert their own tracker data" ON tracker_data;
DROP POLICY IF EXISTS "Users can update their own tracker data" ON tracker_data;
DROP POLICY IF EXISTS "Users can delete their own tracker data" ON tracker_data;
DROP POLICY IF EXISTS "Anyone can view all tracker data for leaderboard" ON tracker_data;

-- 5. Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view all profiles for leaderboard"
  ON user_profiles
  FOR SELECT
  USING (true);

-- 6. Create policies for tracker_data
CREATE POLICY "Users can view their own tracker data"
  ON tracker_data
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracker data"
  ON tracker_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracker data"
  ON tracker_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracker data"
  ON tracker_data
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view all tracker data for leaderboard"
  ON tracker_data
  FOR SELECT
  USING (true);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON user_profiles(username);
CREATE INDEX IF NOT EXISTS tracker_data_user_id_idx ON tracker_data(user_id);

-- 8. Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tracker_data_updated_at ON tracker_data;
CREATE TRIGGER update_tracker_data_updated_at
  BEFORE UPDATE ON tracker_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Create a view for leaderboard (makes queries easier)
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  up.username,
  up.user_id,
  td.failed_days,
  td.current_day,
  td.updated_at,
  COALESCE(array_length(td.failed_days, 1), 0) as failed_count
FROM user_profiles up
LEFT JOIN tracker_data td ON up.user_id = td.user_id
ORDER BY failed_count ASC, td.current_day DESC;

-- 11. Auth trigger: create profile with provided username (no suffixing)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_name text;
  sanitized text;
BEGIN
  -- Read username from auth user's metadata; fallback to email local-part
  raw_name := COALESCE(NULLIF(TRIM((NEW.raw_user_meta_data->>'username')::text), ''), split_part(NEW.email, '@', 1));

  -- Sanitize to [a-z0-9_] and lowercase
  sanitized := lower(regexp_replace(raw_name, '[^a-z0-9_]', '_', 'gi'));

  -- Validate length and format
  IF sanitized IS NULL OR length(sanitized) < 3 OR length(sanitized) > 20 THEN
    RAISE EXCEPTION 'Invalid username';
  END IF;
  IF sanitized !~ '^[a-z0-9_]+$' THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;

  -- Enforce uniqueness via constraint; pre-check to return clearer error
  IF EXISTS (SELECT 1 FROM public.user_profiles WHERE username = sanitized) THEN
    RAISE EXCEPTION 'Username is already taken';
  END IF;

  INSERT INTO public.user_profiles(user_id, username)
  VALUES (NEW.id, sanitized);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

