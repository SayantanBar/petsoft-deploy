"use client";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { logIn, signUp } from "@/actions/actions";
import AuthFormButton from "./auth-form-btn";
import { useFormState } from "react-dom";

type AuthFormProps = {
  type: "signup" | "login";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);

  const [logInError, dispatchLogin] = useFormState(logIn, undefined);
  return (
    <form action={type === "login" ? dispatchLogin : dispatchSignUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" required maxLength={100} />
      </div>
      <div className="space-y-1 mt-2 mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          maxLength={100}
        />
      </div>
      <AuthFormButton type={type} />
      {signUpError && (
        <p className="text-red-500 text-sm mt-2">{signUpError.message}</p>
      )}

      {logInError && (
        <p className="text-red-500 text-sm mt-2">{logInError.message}</p>
      )}
    </form>
  );
};

export default AuthForm;
