import { redirect } from "next/navigation";

export default function AccountHomeRedirectPage() {
  redirect("/dashboard");
}
