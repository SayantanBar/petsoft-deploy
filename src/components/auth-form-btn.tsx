"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
type AuthFormButtonProps = {
  type: "login" | "signup";
};
const AuthFormButton = ({ type }: AuthFormButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      {type === "login" ? "Log in" : "Sign up"}
    </Button>
  );
};

export default AuthFormButton;
