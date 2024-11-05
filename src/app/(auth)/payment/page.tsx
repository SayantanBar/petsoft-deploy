"use client";
import { createCheckoutSession } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();
  return (
    <main className="flex flex-col items-center space-y-10">
      <h1>Patsoft access require payment</h1>
      {searchParams.success && (
        <Button
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
          disabled={status == "loading" || session?.user.hasAccess}
        >
          Access Petsoft
        </Button>
      )}
      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}
      {searchParams.success && (
        <p className="text-xl text-green-700">
          Payment successful! you have now lifetime access to Petsoft.
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-xl text-red-700">
          payment cancelled! you can try again.
        </p>
      )}
    </main>
  );
}
