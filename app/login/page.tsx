import { LoginForm } from "./login-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/guests");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 px-6 py-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-gray-400">
          Log in with the name and contact info you used to RSVP.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-gray-500">
        Haven&apos;t signed up yet?{" "}
        <Link href="/signup" className="text-purple-400 hover:text-purple-300">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
