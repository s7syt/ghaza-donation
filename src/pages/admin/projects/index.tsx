
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  ChevronDown,
  ImagePlus,
  AlertCircle,
  Star  
} from "lucide-react";

import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
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
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: number;
  title: string;
  goal: number;
  raised: number;
  is_active: boolean;
  is_featured: boolean;
  start_date: string;
  end_date: string | null;
  main_image: string | null;
  creator_name: string;
  donations_count: number;
  created_at: string;
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [projectToFeature, setProjectToFeature] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);
  
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gaza-admin-token")}`
        }
      });
      setProjects(response.data);
      setFilteredProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المشاريع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await axios.delete(`/api/admin/projects/${projectToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gaza-admin-token")}`
        }
      });
      
      toast({
        title: "تم الحذف",
        description: "تم حذف المشروع بنجاح",
      });
      
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المشروع",
        variant: "destructive",
      });
    } finally {
      setProjectToDelete(null);
    }
  };
  
  const handleFeatureProject = async () => {
    if (!projectToFeature) return;
    
    try {
      await axios.post(`/api/admin/projects/${projectToFeature}/feature`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gaza-admin-token")}`
        }
      });
      
      toast({
        title: "تم التمييز",
        description: "تم تمييز المشروع بنجاح في الصفحة الرئيسية",
      });
      
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error("Error featuring project:", error);
      toast({
        title: "خطأ",
        description: "فشل في تمييز المشروع",
        variant: "destructive",
      });
    } finally {
      setProjectToFeature(null);
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-EG') + " $";
  };
  
  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">إدارة المشاريع</h1>
              <p className="text-muted-foreground">
                عرض وإضافة وتعديل وحذف المشاريع
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button className="bg-gaza-primary hover:bg-gaza-primary/90" asChild>
                <Link to="/admin/projects/create">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة مشروع جديد
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="البحث عن مشروع..." 
                  className="pr-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Projects Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>اسم المشروع</TableHead>
                  <TableHead className="text-center">المبلغ المستهدف</TableHead>
                  <TableHead className="text-center">المبلغ المجموع</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead className="text-center">مميز</TableHead>
                  <TableHead className="text-center">تاريخ البدء</TableHead>
                  <TableHead className="text-center">المنشئ</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-8 h-8 animate-spin"></div>
                      <p className="mt-2">جاري تحميل البيانات...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2">لا توجد مشاريع للعرض</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project, index) => (
                    <TableRow key={project.id} className={project.is_featured ? "bg-gaza-primary/5" : ""}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded overflow-hidden bg-muted ml-3">
                            {project.main_image ? (
                              <img
                                src={project.main_image}
                                alt={project.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted">
                                <ImagePlus size={16} />
                              </div>
                            )}
                          </div>
                          <div className="font-medium truncate max-w-[200px]">
                            {project.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(project.goal)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(project.raised)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={project.is_active ? "default" : "secondary"}>
                          {project.is_active ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {project.is_featured ? (
                          <Star className="mx-auto h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <Star className="mx-auto h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(project.start_date)}
                      </TableCell>
                      <TableCell className="text-center">
                        {project.creator_name}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">فتح القائمة</span>
                              <ChevronDown size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/projects/edit/${project.id}`} className="cursor-pointer">
                                <Edit className="ml-2" size={14} />
                                تعديل المشروع
                              </Link>
                            </DropdownMenuItem>
                            {!project.is_featured && (
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => setProjectToFeature(project.id)}
                              >
                                <Star className="ml-2" size={14} />
                                تمييز المشروع
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link to={`/projects/${project.id}`} target="_blank" className="cursor-pointer">
                                <Search className="ml-2" size={14} />
                                عرض في الموقع
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-destructive focus:text-destructive"
                              onClick={() => setProjectToDelete(project.id)}
                            >
                              <Trash2 className="ml-2" size={14} />
                              حذف المشروع
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من حذف هذا المشروع؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف المشروع وجميع البيانات المرتبطة به بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteProject}
              >
                حذف المشروع
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Feature Confirmation Dialog */}
        <AlertDialog open={!!projectToFeature} onOpenChange={(open) => !open && setProjectToFeature(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تمييز المشروع في الصفحة الرئيسية</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم تمييز المشروع وعرضه بشكل خاص في الصفحة الرئيسية. سيتم إلغاء تمييز أي مشروع آخر مميز حالياً.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                className="bg-gaza-primary text-white hover:bg-gaza-primary/90"
                onClick={handleFeatureProject}
              >
                تمييز المشروع
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthMiddleware>
  );
}
