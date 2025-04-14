
import { query } from './db.js';

// Get paginated members with optional search
export async function getMembers(page = 1, limit = 10, search = '') {
  const offset = (page - 1) * limit;
  
  let sql = `
    SELECT 
      u.id, 
      u.name, 
      u.username as email, 
      '' as phone, 
      u.is_active as isActive, 
      u.created_at as registrationDate, 
      u.last_seen as lastLoginDate 
    FROM 
      users u 
    WHERE 
      u.role = 'user'
  `;
  
  const params = [];
  
  if (search) {
    sql += ` AND (u.name LIKE ? OR u.username LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  
  sql += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const members = await query(sql, params);
  
  // Get total count for pagination
  let countSql = `
    SELECT COUNT(*) as total 
    FROM users u 
    WHERE u.role = 'user'
  `;
  
  if (search) {
    countSql += ` AND (u.name LIKE ? OR u.username LIKE ?)`;
  }
  
  const countParams = search ? [`%${search}%`, `%${search}%`] : [];
  const countResult = await query(countSql, countParams);
  const total = countResult[0].total;
  
  const totalPages = Math.ceil(total / limit);
  
  return {
    members,
    total,
    totalPages
  };
}

// Get detailed information for a specific member
export async function getMemberDetails(memberId) {
  // Get basic member information
  const memberSql = `
    SELECT 
      u.id, 
      u.name, 
      u.username as email, 
      '' as phone, 
      u.is_active as isActive, 
      u.created_at as registrationDate, 
      u.last_seen as lastLoginDate 
    FROM 
      users u 
    WHERE 
      u.id = ? AND u.role = 'user'
  `;
  
  const members = await query(memberSql, [memberId]);
  
  if (members.length === 0) {
    return null;
  }
  
  const member = members[0];
  
  // Get member's donations
  const donationsSql = `
    SELECT 
      d.id, 
      d.amount, 
      p.title as projectName, 
      d.donation_date as date 
    FROM 
      donations d 
    JOIN 
      projects p ON d.project_id = p.id 
    WHERE 
      d.donor_id = ? 
    ORDER BY 
      d.donation_date DESC
  `;
  
  const donations = await query(donationsSql, [memberId]);
  
  return {
    ...member,
    donations
  };
}

// Update member status (active/inactive)
export async function updateMemberStatus(memberId, isActive) {
  const sql = `
    UPDATE users 
    SET is_active = ? 
    WHERE id = ? AND role = 'user'
  `;
  
  await query(sql, [isActive ? 1 : 0, memberId]);
  
  return { success: true };
}

// Delete a member
export async function deleteMember(memberId) {
  // Check if member exists
  const memberSql = `SELECT id FROM users WHERE id = ? AND role = 'user'`;
  const members = await query(memberSql, [memberId]);
  
  if (members.length === 0) {
    throw new Error('العضو غير موجود');
  }
  
  // Delete member's donations
  await query(`DELETE FROM donations WHERE donor_id = ?`, [memberId]);
  
  // Delete member
  await query(`DELETE FROM users WHERE id = ? AND role = 'user'`, [memberId]);
  
  return { success: true };
}
