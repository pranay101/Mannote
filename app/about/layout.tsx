import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Mannote | The visual way to organize your ideas & projects",
  description:
    "Learn about Mannote, a visual workspace that helps you organize your ideas and projects into beautiful boards. Discover our features and how to use them.",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
