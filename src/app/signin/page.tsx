import { redirect } from "next/navigation";

// /signin is an old alias — the account lives at /account.
export default function SigninPage() {
  redirect("/account");
}
