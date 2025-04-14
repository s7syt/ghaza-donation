
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/layout";
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
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Save,
  Globe,
  Share2,
  CheckCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schema
const socialLinksSchema = z.object({
  site_email: z.string().email("البريد الإلكتروني غير صالح"),
  site_phone: z.string().min(1, "رقم الهاتف مطلوب"),
  site_whatsapp: z.string().min(1, "رقم الواتساب مطلوب"),
  facebook_url: z.string().optional(),
  twitter_url: z.string().optional(),
  instagram_url: z.string().optional(),
  youtube_url: z.string().optional()
});

export default function SocialLinksPage() {
  const [loading, setLoading] = useState(true);
  
  // Setup form with validation
  const form = useForm<z.infer<typeof socialLinksSchema>>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      site_email: "",
      site_phone: "",
      site_whatsapp: "",
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
      youtube_url: ""
    }
  });
  
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const settings = await getSiteSettings();
        
        // Update form with fetched settings
        form.reset({
          site_email: settings.site_email || "",
          site_phone: settings.site_phone || "",
          site_whatsapp: settings.site_whatsapp || "",
          facebook_url: settings.facebook_url || "",
          twitter_url: settings.twitter_url || "",
          instagram_url: settings.instagram_url || "",
          youtube_url: settings.youtube_url || ""
        });
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل البيانات");
        console.error("Error loading site settings:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, [form]);
  
  async function onSubmit(data: z.infer<typeof socialLinksSchema>) {
    try {
      setLoading(true);
      await updateSiteSettings(data);
      toast.success("تم تحديث روابط التواصل بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث البيانات");
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
          <h1 className="text-3xl font-bold">روابط التواصل</h1>
          <p className="text-muted-foreground mt-1">
            إدارة معلومات الاتصال وروابط التواصل الاجتماعي للموقع
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>معلومات الاتصال</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>وسائل التواصل</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الاتصال</CardTitle>
                    <CardDescription>
                      بيانات الاتصال الرئيسية التي سيستخدمها الزوار للتواصل معك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="site_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> البريد الإلكتروني
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="info@example.com" 
                              {...field}
                              dir="ltr"
                              className="text-left"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="site_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" /> رقم الهاتف
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+970 59 123 4567" 
                              {...field}
                              dir="ltr"
                              className="text-left"
                            />
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
                          <FormLabel className="flex items-center gap-2">
                            <Globe className="h-4 w-4" /> رقم واتساب
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+970 59 123 4567" 
                              {...field}
                              dir="ltr"
                              className="text-left"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>روابط التواصل الاجتماعي</CardTitle>
                    <CardDescription>
                      روابط حسابات المنصة على وسائل التواصل الاجتماعي
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="facebook_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Facebook className="h-4 w-4 text-blue-600" /> فيسبوك
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://facebook.com/gazaaid" 
                              {...field}
                              dir="ltr"
                              className="text-left"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="twitter_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Twitter className="h-4 w-4 text-blue-400" /> تويتر
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://twitter.com/gazaaid" 
                              {...field}
                              dir="ltr"
                              className="text-left"
                            />
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
                          <FormLabel className="flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-pink-500" /> انستجرام
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://instagram.com/gazaaid" 
                              {...field}
                              dir="ltr"
                              className="text-left"
                            />
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
                          <FormLabel className="flex items-center gap-2">
                            <Youtube className="h-4 w-4 text-red-600" /> يوتيوب
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://youtube.com/gazaaid" 
                              {...field}
                              dir="ltr"
                              className="text-left"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>حفظ التغييرات</span>
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
