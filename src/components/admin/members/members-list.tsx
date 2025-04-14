
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  UserCheck,
  UserX,
  Search,
  MoreHorizontal,
  Trash2,
  Eye
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { updateMemberStatus, deleteMember } from "@/api/adminApi";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  registrationDate: string;
  lastLoginDate: string | null;
}

interface MembersListProps {
  members: Member[];
  onSearch: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function MembersList({ members, onSearch, onRefresh, isLoading }: MembersListProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleUpdateStatus = async (member: Member) => {
    try {
      await updateMemberStatus(member.id, !member.isActive);
      toast.success(`تم ${member.isActive ? "تعطيل" : "تفعيل"} العضو بنجاح`);
      onRefresh();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة العضو");
    }
  };
  
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      await deleteMember(memberToDelete.id);
      toast.success("تم حذف العضو بنجاح");
      setMemberToDelete(null);
      onRefresh();
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
  
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <Input
            placeholder="البحث عن عضو..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit" variant="outline" className="mr-2">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Button onClick={onRefresh} variant="outline">
          تحديث
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : members.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">لا يوجد أعضاء للعرض</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>آخر تسجيل دخول</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{formatDate(member.registrationDate)}</TableCell>
                  <TableCell>
                    {formatDate(member.lastLoginDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.isActive ? "default" : "destructive"}
                      className="capitalize"
                    >
                      {member.isActive ? "مفعل" : "معطل"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/members/${member.id}`)}>
                          <Eye className="ml-2 h-4 w-4" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(member)}>
                          {member.isActive ? (
                            <>
                              <UserX className="ml-2 h-4 w-4" />
                              تعطيل العضو
                            </>
                          ) : (
                            <>
                              <UserCheck className="ml-2 h-4 w-4" />
                              تفعيل العضو
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMemberToDelete(member)}>
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف العضو
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
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
