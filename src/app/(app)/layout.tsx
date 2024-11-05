import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-patter";
import PetContextProvider from "../contexts/pet-context-provider";
import SearchContextProvider from "../contexts/search-context-provider";
import prisma from "@/lib/db";
import { Toaster } from "@/components/ui/sonner";
import { checkAuth, getPetsByUserId } from "@/lib/server-utils";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await checkAuth();

  const data = await getPetsByUserId(session.user.id);

  return (
    <>
      <BackgroundPattern />
      <div className="flex flex-col min-h-screen max-w-[1050px] mx-auto px-4">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider data={data}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
};

export default Layout;
