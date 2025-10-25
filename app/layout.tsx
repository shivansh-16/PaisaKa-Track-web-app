'use client';

    import type { Metadata } from 'next';
    import { Inter } from 'next/font/google';
    import './globals.css';
    import { AuthProvider } from '@/context/AuthContext';
    import { LanguageProvider } from '@/context/LanguageContext';
    import { ExpenseProvider } from '@/context/ExpenseContext';
    import { IncomeProvider } from '@/context/IncomeContext';
    import { TotalBalanceProvider } from '@/context/TotalBalanceContext';

    const inter = Inter({ subsets: ['latin'] });

    export const metadata: Metadata = {
      title: 'PaisaKa Track',
      description: 'Track your expenses and incomes',
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body className={inter.className}>
            <AuthProvider>
              <LanguageProvider>
                <ExpenseProvider>
                  <IncomeProvider>
                    <TotalBalanceProvider>
                      {children}
                    </TotalBalanceProvider>
                  </IncomeProvider>
                </ExpenseProvider>
              </LanguageProvider>
            </AuthProvider>
          </body>
        </html>
      );
    }
