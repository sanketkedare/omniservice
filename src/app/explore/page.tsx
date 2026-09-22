import CategoriesPage from "@/app/customer/categories/page";
import { TopBar } from "@/components/layout/TopBar";
import { CustomerNav } from "@/components/layout/CustomerNav";

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5] font-serif">
      <TopBar />
      <main className="flex-1 pb-20 sm:pb-8">
        <CategoriesPage />
      </main>
      <CustomerNav />
    </div>
  );
}
