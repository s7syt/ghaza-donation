
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube, Linkedin, MessageCircle } from "lucide-react";
import { SiteSettings, getSiteSettings } from "@/api/siteSettingsApi";

// Custom TikTok icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-tiktok"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path d="M15 8v8a4 4 0 0 1-4 4" />
    <line x1="15" y1="4" x2="15" y2="12" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading site settings:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, []);

  return (
    <footer className="bg-muted text-muted-foreground mt-20">
      <div className="gaza-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              {settings.site_name || "منصة دعم غزة"}
            </h3>
            <p className="mb-4">
              منصة خيرية مخصصة لدعم أهل غزة في وقت الأزمات. نعمل على توصيل المساعدات الإنسانية لمن يحتاجها.
            </p>
            <div className="flex items-center text-gaza-primary">
              <Heart size={18} className="ml-1" />
              <span>معاً لدعم صمود أهلنا في غزة</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">روابط سريعة</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-gaza-primary transition-colors">
                الرئيسية
              </Link>
              <Link to="/projects" className="hover:text-gaza-primary transition-colors">
                المشاريع
              </Link>
              <Link to="/about" className="hover:text-gaza-primary transition-colors">
                عن المنصة
              </Link>
              <Link to="/contact" className="hover:text-gaza-primary transition-colors">
                اتصل بنا
              </Link>
              <Link to="/admin/login" className="hover:text-gaza-primary transition-colors">
                دخول الإدارة
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">معلومات الاتصال</h3>
            <div className="space-y-3">
              {settings.site_address && (
                <div className="flex items-start">
                  <MapPin size={18} className="ml-2 mt-1 text-gaza-primary" />
                  <span>{settings.site_address}</span>
                </div>
              )}
              
              {settings.site_phone && (
                <div className="flex items-center">
                  <Phone size={18} className="ml-2 text-gaza-primary" />
                  <span>{settings.site_phone}</span>
                </div>
              )}
              
              {settings.site_email && (
                <div className="flex items-center">
                  <Mail size={18} className="ml-2 text-gaza-primary" />
                  <a href={`mailto:${settings.site_email}`} className="hover:text-gaza-primary transition-colors">
                    {settings.site_email}
                  </a>
                </div>
              )}
              
              {/* Social Media Links */}
              <div className="flex items-center space-x-3 space-x-reverse pt-2">
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" 
                     className="bg-muted-foreground/10 p-2 rounded-full hover:bg-gaza-primary/20 transition-colors">
                    <Facebook size={16} className="text-gaza-primary" />
                  </a>
                )}
                
                {settings.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"
                     className="bg-muted-foreground/10 p-2 rounded-full hover:bg-gaza-primary/20 transition-colors">
                    <Twitter size={16} className="text-gaza-primary" />
                  </a>
                )}
                
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                     className="bg-muted-foreground/10 p-2 rounded-full hover:bg-gaza-primary/20 transition-colors">
                    <Instagram size={16} className="text-gaza-primary" />
                  </a>
                )}
                
                {settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                     className="bg-muted-foreground/10 p-2 rounded-full hover:bg-gaza-primary/20 transition-colors">
                    <Youtube size={16} className="text-gaza-primary" />
                  </a>
                )}
                
                {settings.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
                     className="bg-muted-foreground/10 p-2 rounded-full hover:bg-gaza-primary/20 transition-colors">
                    <Linkedin size={16} className="text-gaza-primary" />
                  </a>
                )}
                
                {settings.telegram_url && (
                  <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer"
                     className="bg-muted-foreground/10 p-2 rounded-full hover:bg-gaza-primary/20 transition-colors">
                    <MessageCircle size={16} className="text-gaza-primary" />
                  </a>
                )}
                
                {settings.tiktok_url && (
                  <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer"
                     className="bg-muted-foreground/10 p-2 rounded-full hover:bg-gaza-primary/20 transition-colors">
                    <TikTokIcon className="text-gaza-primary" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p>
            جميع الحقوق محفوظة © {currentYear} {settings.site_name || "منصة دعم غزة"}
          </p>
        </div>
      </div>
    </footer>
  );
}
