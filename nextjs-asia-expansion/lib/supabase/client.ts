/**
 * Supabase client setup
 * Install: npm install @supabase/supabase-js
 */

import { createClient } from '@supabase/supabase-js';

// Extract project reference from connection URI
// Your URI: db.riimwxyjsqatyvttdajp.supabase.co
// Project ref: riimwxyjsqatyvttdajp
// Project URL: https://riimwxyjsqatyvttdajp.supabase.co

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://riimwxyjsqatyvttdajp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaW13eHlqc3FhdHl2dHRkYWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDc0NTIsImV4cCI6MjA3NTgyMzQ1Mn0.rpSqlb0zntTYSe6-gHWmHUTZajU7cCaXzqFuahQdcJs';

// Direct PostgreSQL connection string (for server-side use with pg library)
export const POSTGRES_URI = process.env.DATABASE_URL || 'postgresql://postgres:[J_@sra@1996]@db.riimwxyjsqatyvttdajp.supabase.co:5432/postgres';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaW13eHlqc3FhdHl2dHRkYWpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDI0NzQ1MiwiZXhwIjoyMDc1ODIzNDUyfQ.WsqYZyS2IxDiUUG6Xfrf07oSx99cjcoKKqMw1fZVklk';
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Example Supabase schema for reference:
/*
-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SGD',
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  engine TEXT,
  images TEXT[],
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  seller_name TEXT,
  seller_type TEXT CHECK (seller_type IN ('dealer', 'private')),
  user_id UUID REFERENCES auth.users(id),
  forum_thread_id UUID REFERENCES forum_threads(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired')),
  views INTEGER DEFAULT 0,
  rating NUMERIC,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listings_country ON listings(country);
CREATE INDEX idx_listings_make ON listings(make);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_year ON listings(year);

-- Forum threads table
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id UUID REFERENCES listings(id),
  view_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forum_threads_country ON forum_threads(country);
CREATE INDEX idx_forum_threads_category ON forum_threads(category);
CREATE INDEX idx_forum_threads_created_at ON forum_threads(created_at DESC);
CREATE INDEX idx_forum_threads_user_id ON forum_threads(user_id);

-- Forum posts table
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forum_posts_thread_id ON forum_posts(thread_id);
CREATE INDEX idx_forum_posts_parent_id ON forum_posts(parent_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);

-- Forum users table (extends auth.users)
CREATE TABLE forum_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  country TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RPC Functions
CREATE OR REPLACE FUNCTION increment_thread_views(thread_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_threads
  SET view_count = view_count + 1
  WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_thread_post_count(thread_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_threads
  SET post_count = post_count + 1,
      updated_at = NOW()
  WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql;
*/
