import { query } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// دالة للحصول على جميع المشاريع النشطة
export async function getActiveProjects() {
  return await query(
    `SELECT p.*, 
     (SELECT image_url FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image 
     FROM projects p 
     WHERE p.is_active = 1 
     ORDER BY p.is_featured DESC, p.created_at DESC`
  );
}

// دالة للحصول على المشروع المميز
export async function getFeaturedProject() {
  const featuredProjects = await query(
    `SELECT p.*, 
     (SELECT image_url FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image 
     FROM projects p 
     WHERE p.is_active = 1 AND p.is_featured = 1 
     LIMIT 1`
  );
  
  return featuredProjects.length > 0 ? featuredProjects[0] : null;
}

// دالة لتمييز مشروع 
export async function setFeaturedProject(projectId) {
  // إلغاء تمييز جميع المشاريع أولاً
  await query(
    `UPDATE projects SET is_featured = 0 WHERE is_featured = 1`
  );
  
  // تمييز المشروع المختار
  return await query(
    `UPDATE projects SET is_featured = 1 WHERE id = ?`,
    [projectId]
  );
}

// دالة للحصول على تفاصيل مشروع معين
export async function getProjectById(projectId) {
  const projects = await query(
    `SELECT * FROM projects WHERE id = ?`,
    [projectId]
  );
  
  if (projects.length === 0) {
    return null;
  }
  
  return projects[0];
}

// دالة للحصول على صور مشروع معين
export async function getProjectImages(projectId) {
  return await query(
    `SELECT * FROM project_images WHERE project_id = ? ORDER BY is_main DESC, id ASC`,
    [projectId]
  );
}

// دالة للحصول على التبرعات الخاصة بمشروع معين
export async function getProjectDonations(projectId) {
  return await query(
    `SELECT d.*, dn.name as donor_name 
     FROM donations d 
     JOIN donors dn ON d.donor_id = dn.id 
     WHERE d.project_id = ? 
     ORDER BY d.donation_date DESC`,
    [projectId]
  );
}

// دالة لإنشاء مشروع جديد
export async function createProject(projectData, userId) {
  const { title, description, goal, startDate, endDate, isFeatured } = projectData;
  
  const result = await query(
    `INSERT INTO projects (title, description, goal, start_date, end_date, is_featured, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, goal, startDate, endDate, isFeatured || false, userId]
  );
  
  return result.insertId;
}

// دالة لرفع صور المشروع
export async function uploadProjectImages(projectId, images, mainImageIndex = 0) {
  // إنشاء مجلد لتخزين الصور إذا لم يكن موجودًا
  const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'projects');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const uploadResults = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const isMain = i === parseInt(mainImageIndex);
    
    // إنشاء اسم ملف فريد باستخدام معرف المشروع والطابع الزمني
    const filename = `project_${projectId}_${Date.now()}_${i}${path.extname(image.originalname)}`;
    const filePath = path.join(uploadsDir, filename);
    
    // حفظ الصورة إلى المجلد
    await fs.promises.writeFile(filePath, image.buffer);
    
    // تخزين بيانات الصورة في قاعدة البيانات
    const imageUrl = `/uploads/projects/${filename}`;
    const result = await addProjectImage(projectId, imageUrl, isMain);
    
    uploadResults.push({
      id: result.insertId,
      projectId,
      imageUrl,
      isMain
    });
  }
  
  return uploadResults;
}

// دالة لتحديث بيانات مشروع
export async function updateProject(projectId, projectData) {
  const { title, description, goal, startDate, endDate, isActive, isFeatured } = projectData;
  
  // إذا كان المشروع سيتم تمييزه، ألغِ تمييز باقي المشاريع أولاً
  if (isFeatured) {
    await query(
      `UPDATE projects SET is_featured = 0 WHERE id != ?`,
      [projectId]
    );
  }
  
  return await query(
    `UPDATE projects 
     SET title = ?, description = ?, goal = ?, start_date = ?, end_date = ?, is_active = ?, is_featured = ? 
     WHERE id = ?`,
    [title, description, goal, startDate, endDate, isActive, isFeatured || false, projectId]
  );
}

// دالة لحذف مشروع
export async function deleteProject(projectId) {
  return await query(
    `DELETE FROM projects WHERE id = ?`,
    [projectId]
  );
}

// دالة لإضافة صورة لمشروع
export async function addProjectImage(projectId, imageUrl, isMain = false) {
  // إذا كانت الصورة رئيسية، قم بإلغاء تعيين الصور الرئيسية الأخرى
  if (isMain) {
    await query(
      `UPDATE project_images SET is_main = 0 WHERE project_id = ?`,
      [projectId]
    );
  }
  
  return await query(
    `INSERT INTO project_images (project_id, image_url, is_main) VALUES (?, ?, ?)`,
    [projectId, imageUrl, isMain]
  );
}

// دالة للحصول على إحصائيات التبرعات الشهرية لمشروع
export async function getMonthlyDonations(projectId = null) {
  const sql = projectId 
    ? `SELECT DATE_FORMAT(donation_date, '%Y-%m') as month, SUM(amount) as total 
       FROM donations 
       WHERE project_id = ? 
       GROUP BY DATE_FORMAT(donation_date, '%Y-%m') 
       ORDER BY month`
    : `SELECT DATE_FORMAT(donation_date, '%Y-%m') as month, SUM(amount) as total 
       FROM donations 
       GROUP BY DATE_FORMAT(donation_date, '%Y-%m') 
       ORDER BY month`;
       
  const params = projectId ? [projectId] : [];
  return await query(sql, params);
}

// دالة للحصول على قائمة المشاريع للوحة الإدارة
export async function getAdminProjects() {
  return await query(
    `SELECT p.*, 
     (SELECT image_url FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image,
     (SELECT COUNT(*) FROM donations WHERE project_id = p.id) as donations_count,
     u.name as creator_name
     FROM projects p 
     LEFT JOIN users u ON p.created_by = u.id
     ORDER BY p.is_featured DESC, p.created_at DESC`
  );
}
