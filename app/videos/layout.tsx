import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Video Learning - CyberSafe Hub",
  description: "Learn cybersecurity through interactive video lessons and real-time decision making",
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}