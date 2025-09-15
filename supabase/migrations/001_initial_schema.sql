-- Initial schema for TheFavrs website
-- Based on data-model.md specification

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Contact Submissions
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
    assigned_to UUID
);

CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_submitted ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_email ON contact_submissions(email);

-- Admin Users (for future CMS)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Add foreign key constraint for contact assignments
ALTER TABLE contact_submissions
ADD CONSTRAINT fk_contact_assigned_to
FOREIGN KEY (assigned_to) REFERENCES admin_users(id);

-- Page Content (for future CMS)
CREATE TABLE page_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

CREATE INDEX idx_page_updated ON page_content(updated_at DESC);
CREATE INDEX idx_page_slug ON page_content(slug);

-- Service Offerings
CREATE TABLE service_offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100),
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_order ON service_offerings(display_order);
CREATE INDEX idx_service_active ON service_offerings(is_active);

-- Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    image_url VARCHAR(500),
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_team_order ON team_members(display_order);
CREATE INDEX idx_team_active ON team_members(is_active);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_page_content_updated_at
    BEFORE UPDATE ON page_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_service_offerings_updated_at
    BEFORE UPDATE ON service_offerings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Newsletter subscribers: Public can insert, only admins can read/update
CREATE POLICY newsletter_public_insert ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Contact submissions: Public can insert, only admins can read/update
CREATE POLICY contact_public_insert ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Service offerings: Public can read active services
CREATE POLICY service_public_read ON service_offerings
    FOR SELECT USING (is_active = true);

-- Team members: Public can read active members
CREATE POLICY team_public_read ON team_members
    FOR SELECT USING (is_active = true);

-- Page content: Public can read published content
CREATE POLICY page_public_read ON page_content
    FOR SELECT USING (true);