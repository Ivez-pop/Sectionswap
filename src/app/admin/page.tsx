import AdminPanel from "@/components/AdminPanel";
import { requireAdmin } from "@/lib/data/dal";
import { getSections, getCommunityLinks } from "@/lib/data/queries";

export const metadata = {
  title: "Admin — KIIT Hub Community",
};

export default async function AdminPage() {
  await requireAdmin(); // redirects non-admins
  const [sections, links] = await Promise.all([
    getSections(),
    getCommunityLinks(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/40 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <AdminPanel sections={sections} links={links} />
    </div>
  );
}
