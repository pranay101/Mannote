"use client";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
