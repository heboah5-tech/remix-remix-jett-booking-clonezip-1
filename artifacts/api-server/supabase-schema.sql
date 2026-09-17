-- Run this SQL in your Supabase SQL editor to create the required tables

-- Visitor Tracking Table
CREATE TABLE IF NOT EXISTS visitor_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page TEXT,
    ip TEXT,
    user_agent TEXT,
    os TEXT,
    device TEXT,
    browser TEXT,
    location TEXT,
    country TEXT,
    sessionData JSONB,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE visitor_tracking
    ADD COLUMN IF NOT EXISTS country TEXT;

-- JETT Bookings Table
CREATE TABLE IF NOT EXISTS jett_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'pending_verification',
    booking_type TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    trip_type TEXT NOT NULL,
    travel_date DATE NOT NULL,
    schedule_id TEXT NOT NULL,
    passengers INTEGER NOT NULL,
    luggage INTEGER NOT NULL DEFAULT 0,
    contact_name TEXT NOT NULL,
    phone_code TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    amount_jod NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE jett_bookings
    ALTER COLUMN email DROP NOT NULL;

ALTER TABLE jett_bookings ENABLE ROW LEVEL SECURITY;

-- Booking creation is performed server-side and does not expose booking reads to anonymous clients.
CREATE POLICY "Allow anonymous booking inserts" ON jett_bookings
    FOR INSERT TO anon WITH CHECK (true);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    card_number TEXT,
    expiry TEXT,
    cvv TEXT,
    name TEXT,
    bank_name TEXT,
    otp TEXT,
    amount NUMERIC,
    currency TEXT,
    visitor_id UUID, -- Optional foreign key to visitor_tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE visitor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and selects if you are using the SUPABASE_ANON_KEY in your environment variables
CREATE POLICY "Allow anonymous inserts on visitor_tracking" ON visitor_tracking FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous selects on visitor_tracking" ON visitor_tracking FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous inserts on payments" ON payments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous selects on payments" ON payments FOR SELECT TO anon USING (true);

-- (Optional) If you are using an authenticated user, you would use 'authenticated' instead of 'anon'
