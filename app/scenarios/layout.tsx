import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Scenarios - CyberSafe Hub",
  description: "Learn cybersecurity through interactive scenarios and earn rewards",
};

export default function ScenariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}