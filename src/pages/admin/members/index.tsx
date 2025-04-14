
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { MembersList } from "@/components/admin/members/members-list";
import { MembersPagination } from "@/components/admin/members/members-pagination";
import { getSiteMembers } from "@/api/adminApi";

export default function AdminMembersListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await getSiteMembers(page, 10, searchQuery);
      
      // Transform the data to ensure all required fields exist
      const transformedMembers = response.members.map(member => ({
        ...member,
        // Ensure phone field exists (even if empty)
        phone: member.phone || "",
        // Format dates properly or provide fallbacks
        registrationDate: member.registrationDate || new Date().toISOString(),
        lastLoginDate: member.lastLoginDate || null
      }));
      
      setMembers(transformedMembers);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching site members:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات الأعضاء");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMembers();
  }, [page, searchQuery]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">إدارة الأعضاء</h1>
            <p className="text-muted-foreground">
              عرض وإدارة أعضاء الموقع المسجلين
            </p>
          </div>
          
          <MembersList
            members={members}
            onSearch={handleSearch}
            onRefresh={fetchMembers}
            isLoading={isLoading}
          />
          
          <MembersPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </AuthMiddleware>
  );
}
