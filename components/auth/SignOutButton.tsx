"use client";

import { supabase } from "@/lib/supabase";

type Props = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Fully clears the Supabase session then hard-navigates to login so middleware
 * cannot briefly treat the user as signed-in (avoids /login → /post-login loops).
 */
export default function SignOutButton({ className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.assign("/login");
      }}
    >
      {children}
    </button>
  );
}
