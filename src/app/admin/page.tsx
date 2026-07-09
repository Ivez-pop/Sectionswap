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
    <div className="flex min-h-screen flex-col">
      <AdminPanel sections={sections} links={links} />
    </div>
  );
}
