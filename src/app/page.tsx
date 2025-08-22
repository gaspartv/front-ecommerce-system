"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const route = useRouter();

  useEffect(() => {
    console.log("Redirecionando para a página de login");
    route.push("/sign-in");
  }, [route]);

  return <h1>Página Inicial</h1>;
}
