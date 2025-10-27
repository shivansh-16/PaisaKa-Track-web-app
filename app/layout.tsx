    import type { Metadata } from 'next';
    import { Inter } from 'next/font/google';
    import './globals.css';
    import { AuthProvider } from '@/context/AuthContext';
    import { LanguageProvider } from '@/context/LanguageContext';
    import { ExpenseProvider } from '@/context/ExpenseContext';
    import { IncomeProvider } from '@/context/IncomeContext';
    import { TotalBalanceProvider } from '@/context/TotalBalanceContext';
    import ClientBottomNavWrapper from '@/components/layout/ClientBottomNavWrapper';
    import { cookies } from 'next/headers';

    const inter = Inter({ subsets: ['latin'] });

    export const metadata: Metadata = {
      title: 'PaisaKa Track',
      description: 'Track your expenses and incomes',
    };

    export default async function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      // read the paisaka_lang cookie server-side and set html lang accordingly
      const cookieStore = await cookies();
      const cookieLang = cookieStore.get('paisaka_lang')?.value;
      const lang = cookieLang === 'hi' ? 'hi' : 'en';

      return (
        <html lang={lang}>
          <body className={inter.className}>
            <AuthProvider>
              <LanguageProvider>
                <ExpenseProvider>
                  <IncomeProvider>
                    <TotalBalanceProvider>
                      {children}
                      <ClientBottomNavWrapper />
                    </TotalBalanceProvider>
                  </IncomeProvider>
                </ExpenseProvider>
              </LanguageProvider>
            </AuthProvider>
          </body>
        </html>
      );
    }
