"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (!token) {
      router.push("/login");
    } else {
      setCheckingAuth(false);
      router.push("/dashboard");
    }
  }, [router]);

  if (checkingAuth) return <div>Loading...</div>;

  return <>{children}</>;
}
