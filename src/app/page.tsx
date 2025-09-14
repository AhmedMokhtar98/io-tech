import { redirect } from "next/navigation";

export default function IndexPage() {
  redirect("/en"); // Default locale
}
