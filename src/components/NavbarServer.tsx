import Navbar from "@/components/Navbar";
import { getProfile } from "@/lib/data/dal";

/** Server wrapper: fetches the current profile and renders the client Navbar. */
export default async function NavbarServer() {
  const profile = await getProfile();
  return (
    <Navbar
      isAdmin={profile?.is_admin ?? false}
      fullName={profile?.full_name ?? null}
      email={profile?.email ?? null}
      whatsappNumber={profile?.whatsapp_number ?? null}
      discordHandle={profile?.discord_handle ?? null}
    />
  );
}
