-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS gaza_aid_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gaza_aid_platform;

-- جدول المستخدمين (الأدمن)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_seen TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المشاريع
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  goal DECIMAL(15, 2) NOT NULL,
  raised DECIMAL(15, 2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول صور المشاريع
CREATE TABLE IF NOT EXISTS project_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المتبرعين
CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول التبرعات
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  donor_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول إثباتات الدفع
CREATE TABLE IF NOT EXISTS payment_proofs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  donation_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول طرق الدفع
CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(50) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إدراج البيانات الأولية لإعدادات الموقع
INSERT INTO site_settings (setting_key, setting_value, setting_description) VALUES
('site_name', 'منصة دعم غزة', 'اسم الموقع'),
('site_email', 'info@gaza-aid.org', 'البريد الإلكتروني للموقع'),
('site_phone', '+970 59 123 4567', 'رقم الهاتف'),
('site_whatsapp', '+970 59 123 4567', 'رقم الواتساب'),
('site_address', 'فلسطين، غزة، الشارع الرئيسي', 'عنوان المقر'),
('facebook_url', 'https://facebook.com/gazaaid', 'رابط صفحة فيسبوك'),
('twitter_url', 'https://twitter.com/gazaaid', 'رابط صفحة تويتر'),
('instagram_url', 'https://instagram.com/gazaaid', 'رابط صفحة انستجرام'),
('youtube_url', '', 'رابط قناة يوتيوب')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- إنشاء مستخدم أدمن افتراضي (كلمة المرور: admin123)
-- ملاحظة: كلمة المرور هنا مشفرة بواسطة bcrypt وستحتاج لاستبدالها عند التطبيق الفعلي
INSERT INTO users (username, password, name, role) 
VALUES ('admin', '$2b$10$rNC7dWnP9CJKXUHKr/mEs.xiG2lxb7J0jGvFbZTrg/a2QH3tO4/9a', 'مدير النظام', 'admin')
ON DUPLICATE KEY UPDATE username = 'admin';
