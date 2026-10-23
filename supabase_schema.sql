-- ====================================================================
-- SKULPT FITNESS - CMS DATABASE SCHEMA & SEED DATA
-- Database: Supabase PostgreSQL
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

-- 1. SERVICES / AANBOD TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  num TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRICING PLANS TABLE
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  monthly_price TEXT NOT NULL,
  yearly_price TEXT NOT NULL,
  period_note TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  plan_type TEXT NOT NULL DEFAULT 'standard', -- 'standard' or 'hyrox'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SITE CONTENT (HERO, EDITORIAL, MARQUEES, ABOUT, CONTACT)
CREATE TABLE IF NOT EXISTS public.site_content (
  section TEXT PRIMARY KEY, -- 'hero', 'editorial', 'marquee', 'about', 'contact'
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LEADS & CONTACT FORM SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- SERVICES: Anyone can read, only authenticated admins can write
DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
CREATE POLICY "Admins have full access to services" ON public.services
  FOR ALL USING (auth.role() = 'authenticated');

-- PRICING: Anyone can read, only authenticated admins can write
DROP POLICY IF EXISTS "Public can view pricing" ON public.pricing_plans;
CREATE POLICY "Public can view pricing" ON public.pricing_plans
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to pricing" ON public.pricing_plans;
CREATE POLICY "Admins have full access to pricing" ON public.pricing_plans
  FOR ALL USING (auth.role() = 'authenticated');

-- SITE CONTENT: Anyone can read, only authenticated admins can write
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content" ON public.site_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to site content" ON public.site_content;
CREATE POLICY "Admins have full access to site content" ON public.site_content
  FOR ALL USING (auth.role() = 'authenticated');

-- LEADS: Anyone can insert (submit form), only authenticated admins can read & update
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to leads" ON public.leads;
CREATE POLICY "Admins have full access to leads" ON public.leads
  FOR ALL USING (auth.role() = 'authenticated');


-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

-- Seed Services
INSERT INTO public.services (id, num, title, category, description, image, order_index)
VALUES 
  (
    'fitness',
    '01',
    'Fitness',
    'Full Gym Access',
    'Train independently or with expert guidance in our state-of-the-art gym equipped with premium cardio and strength machines.',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    1
  ),
  (
    'personal-training',
    '02',
    'Personal Training',
    '1-on-1 Coaching',
    '1-on-1 coaching customized to your individual goals, movement mechanics, and lifestyle for lasting, measurable results.',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    2
  ),
  (
    'group-classes',
    '03',
    'Group Classes',
    'High Energy Workouts',
    'High-energy, motivating group sessions led by passionate coaches designed to challenge and elevate you together.',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    3
  ),
  (
    'hyrox',
    '04',
    'Hyrox & Conditioning',
    'Official Affiliate',
    'The premier competition format merging functional strength and endurance. Train in small cohorts with certified coaches.',
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    4
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  order_index = EXCLUDED.order_index;

-- Seed Pricing Plans
INSERT INTO public.pricing_plans (id, title, description, monthly_price, yearly_price, period_note, features, plan_type, order_index)
VALUES
  (
    'individual',
    'Individual',
    'The premier membership to get the absolute most out of your fitness lifestyle. Go all-out with expert, friendly guidance. We''re here for you every single day in the gym.',
    '€ 44,-',
    '€ 38,-',
    '* With a 1-year membership',
    '["Unlimited training", "Personal coaching", "Free access to Group Training & classes", "Custom workout plans", "Vibrant community"]'::jsonb,
    'standard',
    1
  ),
  (
    'family',
    'Family',
    'Join together with family members living at the same address and receive an exclusive family discount. Join with 4 or more, and additional members train for free.',
    '€ 40,-',
    '€ 34,-',
    '* With a 1-year membership',
    '["Unlimited training", "Personal coaching", "Free access to Group Training & classes", "Custom workout plans", "Family discount across household"]'::jsonb,
    'standard',
    2
  ),
  (
    'student',
    'Student',
    'Between 16 and 25 years old, studying hard, and looking to de-stress with a great workout? We have an exclusive student membership designed for you.',
    '€ 38,-',
    '€ 32,-',
    '* With a 1-year membership',
    '["Unlimited training", "Personal coaching", "Free access to Group Training & classes", "Custom workout plans", "Discounted student pricing"]'::jsonb,
    'standard',
    3
  ),
  (
    'hyrox-basic',
    'Hyrox Basic',
    'Train in small cohorts alongside our certified HYROX coaches and challenge yourself to reach peak fitness.',
    '€ 55,-',
    '€ 48,-',
    '* With a 1-year membership',
    '["5x per month access to Group Training", "Training from certified HYROX coaches", "Vibrant community", "Performance benchmarking"]'::jsonb,
    'hyrox',
    4
  ),
  (
    'hyrox-premium',
    'Hyrox Premium',
    'Train in small cohorts alongside our certified HYROX coaches and challenge yourself to reach peak fitness.',
    '€ 75,-',
    '€ 68,-',
    '* With a 1-year membership',
    '["9x per month access to Group Training", "Training from certified HYROX coaches", "Vibrant community", "Competition simulation workouts"]'::jsonb,
    'hyrox',
    5
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  monthly_price = EXCLUDED.monthly_price,
  yearly_price = EXCLUDED.yearly_price,
  period_note = EXCLUDED.period_note,
  features = EXCLUDED.features,
  plan_type = EXCLUDED.plan_type,
  order_index = EXCLUDED.order_index;

-- Seed Site Content Sections
INSERT INTO public.site_content (section, data)
VALUES
  (
    'hero',
    '{
      "badge": "Official Athletic Training Club",
      "headline": "TRAIN TODAY. GROW TOMORROW.",
      "subheadline": "Experience premium equipment, expert coaching, and a vibrant community dedicated to taking your athletic potential to the next level.",
      "cta_primary": "Free Trial Session",
      "cta_secondary": "View Programs"
    }'::jsonb
  ),
  (
    'feature_cards',
    '[
      {
        "id": "coaches",
        "title": "experienced coaches",
        "image": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
        "alt": "Experienced coaches at Apex Fitness guiding an athlete"
      },
      {
        "id": "equipment",
        "title": "best equipment",
        "image": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
        "alt": "State-of-the-art fitness equipment and weights at Apex Fitness"
      },
      {
        "id": "coffee",
        "title": "free coffee",
        "image": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
        "alt": "Fresh coffee and athlete lounge at Apex Fitness"
      }
    ]'::jsonb
  ),
  (
    'editorial',
    '{
      "line1": "Your couch is very",
      "line2": "tastier if you add it",
      "line3": "exhausted lies"
    }'::jsonb
  ),
  (
    'marquee',
    '{
      "text1": "START FAST. FINISH FASTER.",
      "text2": "WANT TO KNOW MORE?"
    }'::jsonb
  ),
  (
    'about',
    '{
      "headline": "Apex Fitness",
      "paragraph1": "At Apex Fitness, we believe in the power of an active and healthy lifestyle. Our modern facility and dedicated trainers are here to help you achieve your personal fitness goals, whether you are taking your first steps or are a seasoned athlete.",
      "paragraph2": "That is why we move beyond the generic talk of weight loss, muscle gain, and basic conditioning. Feeling stronger, happier, more resilient, and truly energized. Yes, that is within your reach. But you have to put in the work. Great results don''t happen by chance.",
      "highlights": [
        "High-end fitness equipment",
        "Experienced coaches",
        "Unlimited workouts",
        "Extensive opening hours",
        "Diverse group classes",
        "Personal training & coaching",
        "Vibrant community"
      ]
    }'::jsonb
  ),
  (
    'contact',
    '{
      "phone": "+1 (555) 234-5678",
      "email": "info@apexfitness.com",
      "address": "100 Athletic Way, Suite 400",
      "hours": "Mon - Fri: 06:00 - 23:00 | Sat - Sun: 08:00 - 18:00",
      "facebook_url": "https://facebook.com",
      "instagram_url": "https://instagram.com"
    }'::jsonb
  )
ON CONFLICT (section) DO UPDATE SET
  data = EXCLUDED.data,
  updated_at = NOW();
