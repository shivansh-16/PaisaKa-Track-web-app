"use client";
import BottomNavigation from "./BottomNavigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ClientBottomNavWrapper() {
  const pathname = usePathname();
  const { user } = useAuth();
  const shouldShowBottomNav = !!user && !pathname.startsWith('/login') && !pathname.startsWith('/signup') && !pathname.startsWith('/welcome');
  return shouldShowBottomNav ? <BottomNavigation /> : null;
}
