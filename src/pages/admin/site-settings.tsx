
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/layout";
import { useNavigate } from "react-router-dom";
import { SiteSettings, getSiteSettings, updateSiteSettings } from "@/api/siteSettingsApi";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoadingSpinner } from "@/components/admin/dashboard/loading-spinner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Globe,
  Save,
  Building,
  Linkedin,
  MessageCircle
} from "lucide-react";

// Custom TikTok icon since lucide-react doesn't have BrandTiktok
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

// Form validation schema
const siteSettingsSchema = z.object({
  site_name: z.string().min(1, "اسم الموقع مطلوب"),
  site_email: z.string().email("البريد الإلكتروني غير صالح"),
  site_phone: z.string().min(1, "رقم الهاتف مطلوب"),
  site_whatsapp: z.string().min(1, "رقم الواتساب مطلوب"),
  site_address: z.string().min(1, "عنوان المقر مطلوب"),
  facebook_url: z.string().optional(),
  twitter_url: z.string().optional(),
  instagram_url: z.string().optional(),
  youtube_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  telegram_url: z.string().optional(),
  tiktok_url: z.string().optional()
});

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Setup form with validation
  const form = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      site_name: "",
      site_email: "",
      site_phone: "",
      site_whatsapp: "",
      site_address: "",
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
      youtube_url: "",
      linkedin_url: "",
      telegram_url: "",
      tiktok_url: ""
    }
  });
  
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const settings = await getSiteSettings();
        
        // Update form with fetched settings
        form.reset({
          site_name: settings.site_name || "",
          site_email: settings.site_email || "",
          site_phone: settings.site_phone || "",
          site_whatsapp: settings.site_whatsapp || "",
          site_address: settings.site_address || "",
          facebook_url: settings.facebook_url || "",
          twitter_url: settings.twitter_url || "",
          instagram_url: settings.instagram_url || "",
          youtube_url: settings.youtube_url || "",
          linkedin_url: settings.linkedin_url || "",
          telegram_url: settings.telegram_url || "",
          tiktok_url: settings.tiktok_url || ""
        });
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل إعدادات الموقع");
        console.error("Error loading site settings:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, [form]);
  
  async function onSubmit(data: z.infer<typeof siteSettingsSchema>) {
    try {
      setLoading(true);
      await updateSiteSettings(data);
      toast.success("تم تحديث إعدادات الموقع بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث إعدادات الموقع");
      console.error("Error updating site settings:", error);
    } finally {
      setLoading(false);
    }
  }
  
  if (loading && !form.formState.isSubmitting) {
    return (
      <AdminLayout>
        <div className="py-20 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
          <p className="text-muted-foreground mt-1">
            إدارة معلومات الاتصال وروابط التواصل الاجتماعي للموقع
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الموقع الأساسية</CardTitle>
                <CardDescription>
                  هذه المعلومات تظهر في أماكن متعددة في الموقع
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Building className="ml-1 h-4 w-4" /> اسم الموقع
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="منصة دعم غزة" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="site_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Mail className="ml-1 h-4 w-4" /> البريد الإلكتروني
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="info@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="site_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Phone className="ml-1 h-4 w-4" /> رقم الهاتف
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+970 59 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="site_whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Globe className="ml-1 h-4 w-4" /> رقم واتساب
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+970 59 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="site_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="ml-1 h-4 w-4" /> العنوان
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="فلسطين، غزة، الشارع الرئيسي" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>روابط التواصل الاجتماعي</CardTitle>
                <CardDescription>
                  روابط وسائل التواصل الاجتماعي الخاصة بالموقع
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="facebook_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Facebook className="ml-1 h-4 w-4" /> فيسبوك
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/gazaaid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instagram_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Instagram className="ml-1 h-4 w-4" /> انستجرام
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/gazaaid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="twitter_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Twitter className="ml-1 h-4 w-4" /> تويتر
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/gazaaid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="youtube_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Youtube className="ml-1 h-4 w-4" /> يوتيوب
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/gazaaid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Linkedin className="ml-1 h-4 w-4" /> لينكد إن
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/company/gazaaid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="telegram_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <MessageCircle className="ml-1 h-4 w-4" /> تليجرام
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://t.me/gazaaid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tiktok_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <TikTokIcon className="ml-1 h-4 w-4" /> تيك توك
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://tiktok.com/@gazaaid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ الإعدادات
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
