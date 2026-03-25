import { SignupForm } from "@/components/signup-form";
import { PhotoUpload } from "@/components/photo-upload";
import { ReferralLink } from "@/components/referral-link";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; success?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();

  if (params.success && session) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-8 px-6 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold">You&apos;re in!</h1>
          <p className="mt-2 text-gray-400">
            Welcome, {session.name}. We&apos;ll see you in May.
          </p>
        </div>

        <PhotoUpload currentUrl={session.profile_pic_url} />
        <ReferralLink code={session.referral_code} />

        <div className="flex gap-4">
          <Link
            href="/guests"
            className="rounded-lg bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500 transition-colors"
          >
            View Guest List
          </Link>
          <Link
            href="/map"
            className="rounded-lg border border-white/20 px-6 py-3 font-medium hover:bg-white/5 transition-colors"
          >
            View Map
          </Link>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-8 px-6 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Already signed up!</h1>
          <p className="mt-2 text-gray-400">
            You&apos;re registered as {session.name}.
          </p>
        </div>

        <PhotoUpload currentUrl={session.profile_pic_url} />
        <ReferralLink code={session.referral_code} />

        <div className="flex gap-4">
          <Link
            href="/guests"
            className="rounded-lg bg-purple-600 px-6 py-3 font-medium hover:bg-purple-500 transition-colors"
          >
            View Guest List
          </Link>
          <Link
            href="/map"
            className="rounded-lg border border-white/20 px-6 py-3 font-medium hover:bg-white/5 transition-colors"
          >
            View Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Sign Up for Delts Reunion</h1>
        <p className="mt-2 text-gray-400">May 1 – 3, 2026</p>
      </div>
      <SignupForm referredBy={params.ref} />
    </div>
  );
}
