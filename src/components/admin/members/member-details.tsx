
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserCheck, UserX, ArrowRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getMemberDetails, updateMemberStatus, deleteMember } from "@/api/adminApi";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  registrationDate: string;
  lastLoginDate: string | null;
  donations?: {
    id: number;
    amount: number;
    projectName: string;
    date: string;
  }[];
}

export function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getMemberDetails(id);
        
        if (data) {
          // Ensure all fields exist
          setMember({
            ...data,
            phone: data.phone || "",
            lastLoginDate: data.lastLoginDate || null,
            donations: data.donations || []
          });
        } else {
          toast.error("لم يتم العثور على العضو");
          navigate('/admin/members');
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل بيانات العضو");
        navigate('/admin/members');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemberDetails();
  }, [id, navigate]);
  
  const handleUpdateStatus = async () => {
    if (!member) return;
    
    try {
      await updateMemberStatus(member.id, !member.isActive);
      setMember({ ...member, isActive: !member.isActive });
      toast.success(`تم ${member.isActive ? "تعطيل" : "تفعيل"} العضو بنجاح`);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة العضو");
    }
  };
  
  const handleDeleteMember = async () => {
    if (!member) return;
    
    try {
      await deleteMember(member.id);
      toast.success("تم حذف العضو بنجاح");
      navigate('/admin/members');
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف العضو");
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "—";
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }
  
  if (!member) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">لم يتم العثور على العضو</p>
        <Button variant="link" onClick={() => navigate('/admin/members')}>
          العودة إلى قائمة الأعضاء
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/members')}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى قائمة الأعضاء
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant={member.isActive ? "destructive" : "default"}
            onClick={handleUpdateStatus}
            className="flex items-center gap-2"
          >
            {member.isActive ? (
              <>
                <UserX className="h-4 w-4" />
                تعطيل العضو
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                تفعيل العضو
              </>
            )}
          </Button>
          
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            حذف العضو
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>معلومات العضو</CardTitle>
            <CardDescription>
              البيانات الأساسية للعضو {member.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-end">
              <Badge
                variant={member.isActive ? "default" : "destructive"}
                className="capitalize"
              >
                {member.isActive ? "مفعل" : "معطل"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input value={member.name} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>اسم المستخدم / البريد الإلكتروني</Label>
              <Input value={member.email} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>تاريخ التسجيل</Label>
              <Input value={formatDate(member.registrationDate)} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>آخر تسجيل دخول</Label>
              <Input 
                value={member.lastLoginDate ? formatDate(member.lastLoginDate) : "لم يسجل الدخول بعد"} 
                readOnly 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>تبرعات العضو</CardTitle>
            <CardDescription>
              قائمة بتبرعات العضو للمشاريع المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {member.donations && member.donations.length > 0 ? (
              <div className="space-y-4">
                {member.donations.map((donation) => (
                  <div key={donation.id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{donation.projectName}</span>
                      <span className="text-primary font-semibold">{donation.amount} $</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(donation.date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">لا توجد تبرعات لهذا العضو</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا العضو؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف العضو نهائيًا من النظام ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
