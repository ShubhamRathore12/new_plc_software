import { redirect } from "next/navigation";

export default function HomePage() {
  // Automatically redirect to login
  redirect("/login");
}
