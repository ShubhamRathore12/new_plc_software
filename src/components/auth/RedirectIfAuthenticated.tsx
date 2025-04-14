"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Props = {
  children: React.ReactNode;
};

export default function RedirectIfAuthenticated({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (token) {
      router.push("/dashboard"); // redirect to dashboard if already logged in
    } else {
      setChecking(false); // show login page if not logged in
    }
  }, [router]);

  if (checking) return <div>Loading...</div>; // optional spinner

  return <>{children}</>;
}
