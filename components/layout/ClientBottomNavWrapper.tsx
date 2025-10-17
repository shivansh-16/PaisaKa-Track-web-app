"use client";
import BottomNavigation from "./BottomNavigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ClientBottomNavWrapper() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Improved logic to hide bottom nav on auth routes
  const shouldShowBottomNav = !!user &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/signup') &&
    !pathname.startsWith('/welcome') &&
    !pathname.startsWith('/(auth)');
  
  return shouldShowBottomNav ? <BottomNavigation /> : null;
}
