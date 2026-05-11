import { redirect } from "next/navigation";

/** Legacy phone-PIN wallet; buyers use the hub wallet at `/account/wallet`. */
export default function LegacyWalletRedirect() {
  redirect("/account/wallet");
}
