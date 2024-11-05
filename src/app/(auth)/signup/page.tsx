import H1 from "@/components/H1";
import AuthForm from "@/components/auth-form";
import Link from "next/link";

const SignupPage = () => {
  return (
    <main>
      <H1 className="text-center mb-5">Sign Up</H1>
      <AuthForm type="signup" />
      <p className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium ">
          Sign In
        </Link>
      </p>
    </main>
  );
};

export default SignupPage;
