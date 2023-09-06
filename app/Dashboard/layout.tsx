'use client'
import { RecoilRoot } from 'recoil'
import '../globals.css'


// app/DashboardLayout.tsx
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
    <RecoilRoot>{children}</RecoilRoot>
</div>
  );
}