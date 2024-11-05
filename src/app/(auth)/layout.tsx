import Logo from "@/components/logo";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-y-5">
      <Logo />
      {children}
    </div>
  );
};

export default Layout;
