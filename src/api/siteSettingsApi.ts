
import axios from 'axios';

const API_BASE_URL = '/api';

export interface SiteSettings {
  site_name?: string;
  site_email?: string;
  site_phone?: string;
  site_whatsapp?: string;
  site_address?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  telegram_url?: string;
  tiktok_url?: string;
  [key: string]: string | undefined;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await axios.get(`${API_BASE_URL}/site-settings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/site-settings/${key}`);
    return response.data.value;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function updateSiteSettings(settings: SiteSettings): Promise<{ message: string }> {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/site-settings`, settings);
    return response.data;
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw error;
  }
}
