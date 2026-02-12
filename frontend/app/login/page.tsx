import { Metadata } from "next";
import LoginPage from "@/components/pages/Login";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return <LoginPage />;
}
