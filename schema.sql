
-- schema.sql
-- منصة دعم غزة - هيكل قاعدة البيانات

-- تمكين UUID للمفاتيح الأساسية
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- الاعدادات العامة للموقع
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- المشرفين (الإدارة)
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- الأعضاء المسجلين
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- المشاريع الخيرية
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    goal DECIMAL(14, 2) NOT NULL,
    raised DECIMAL(14, 2) DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    main_image VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    created_by INTEGER REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- صور المشاريع
CREATE TABLE project_images (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- طرق الدفع المتاحة
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- المتبرعين
CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- التبرعات
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    donor_id INTEGER NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    payment_method_id INTEGER REFERENCES payment_methods(id) ON DELETE SET NULL,
    amount DECIMAL(14, 2) NOT NULL,
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    verified_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- اثباتات الدفع
CREATE TABLE payment_proofs (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    donor_id INTEGER NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- رسائل اتصل بنا
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_date TIMESTAMP,
    read_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- اشتراك القائمة البريدية
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- الاشعارات
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_type VARCHAR(20) NOT NULL, -- 'admin', 'member'
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- إدخال البيانات الأولية
-- =====================

-- ادخال اعدادات الموقع الافتراضية
INSERT INTO site_settings (key, value) VALUES 
('site_name', 'منصة دعم غزة'),
('site_email', 'info@gazaplatform.org'),
('site_phone', '+970-59-1234567'),
('site_whatsapp', '+970-59-1234567'),
('site_address', 'غزة - فلسطين'),
('facebook_url', 'https://facebook.com'),
('twitter_url', 'https://twitter.com'),
('instagram_url', 'https://instagram.com'),
('youtube_url', 'https://youtube.com');

-- إنشاء المشرف الافتراضي (كلمة المرور: admin123)
INSERT INTO admins (name, email, password) VALUES 
('المدير العام', 'admin@gazaplatform.org', '$2a$10$oeKf3a3JGtnY1PB3E1RcHO0gJv1o.nvp2TjxH97GhhHcVpYlA0lVi');

-- إضافة طرق الدفع الافتراضية
INSERT INTO payment_methods (name, address, description, is_active) VALUES 
('بيتكوين', '14Wy5YAnf1MQb9uhR5VzcQzVvcz27rCbXC', 'تبرع عبر عملة البيتكوين', TRUE),
('ايثريوم', '0x3a2cC7DD25DD65C7B7E4A4B84f5A90666cc7Af3d', 'تبرع عبر عملة الايثريوم', TRUE),
('بايبال', 'donations@gazaplatform.org', 'تبرع عبر حساب بايبال', TRUE);

-- إنشاء مشروعين افتراضيين
INSERT INTO projects (title, description, short_description, goal, start_date, is_active, created_by) VALUES 
('دعم المستشفيات في غزة', 'مشروع لدعم المستشفيات والطواقم الطبية في قطاع غزة وتوفير الأدوية والمستلزمات الطبية الضرورية للمرضى والجرحى.', 'دعم المستشفيات وتوفير الأدوية والمستلزمات الطبية الضرورية للمرضى والجرحى في غزة', 50000, CURRENT_TIMESTAMP, TRUE, 1),
('دعم الأسر المتضررة', 'مشروع لتقديم المساعدات العاجلة للأسر المتضررة من الحرب في غزة، ويشمل توفير الطعام والشراب والمأوى للعائلات النازحة.', 'تقديم المساعدات العاجلة للأسر المتضررة من الحرب في غزة وتوفير متطلبات الحياة الأساسية', 30000, CURRENT_TIMESTAMP, TRUE, 1);

-- إضافة متبرع افتراضي
INSERT INTO donors (name, email) VALUES 
('محمد أحمد', 'mohamed@example.com');

-- إضافة تبرعات افتراضية
INSERT INTO donations (project_id, donor_id, payment_method_id, amount, donation_date, is_verified) VALUES 
(1, 1, 1, 1000, NOW() - INTERVAL '2 DAY', TRUE),
(2, 1, 2, 500, NOW() - INTERVAL '1 DAY', TRUE);

-- تحديث المبالغ المجمعة للمشاريع
UPDATE projects SET raised = 1000 WHERE id = 1;
UPDATE projects SET raised = 500 WHERE id = 2;

-- إنشاء فهارس
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_payment_proofs_donation_id ON payment_proofs(donation_id);
CREATE INDEX idx_payment_proofs_donor_id ON payment_proofs(donor_id);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_projects_is_active ON projects(is_active);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_donors_email ON donors(email);

-- إنشاء trigger لتحديث الـ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الـ trigger على الجداول
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
