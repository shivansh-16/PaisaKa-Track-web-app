import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ExpenseProvider } from "@/context/ExpenseContext";
import ClientBottomNavWrapper from "@/components/layout/ClientBottomNavWrapper";
import Toast from "@/components/Toast";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaisaKa Track – Personal & Group Expense Manager",
  description:
    "Simple Indian-friendly expense tracker with groups, splits, analytics, and Hindi-English support.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} style={{ background: 'var(--pk-bg)', color: 'var(--pk-text-primary)' }}>
        <LanguageProvider>
          <AuthProvider>
            <ExpenseProvider>
              <main className="pb-20">{children}</main>
              {/* Bottom Navigation for Mobile */}
              <ClientBottomNavWrapper />
              <Toast />
            </ExpenseProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}