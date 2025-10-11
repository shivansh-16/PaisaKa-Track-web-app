'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'en' | 'hi';

interface LangContextType {
        lang: Lang;
        setLang: (l: Lang) => void;
        T: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
        en: {
                // Welcome & Branding
                'app.name': 'PaisaKa Track',
                'app.tagline': 'Your money, your account',
                'app.taglineHindi': 'आपका पैसा, आपका हिसाब',
                'app.description': 'Simple Indian-friendly expense tracker',
                'welcome.madeInIndia': 'Made with ❤️ in India',
                'welcome.selectLanguage': 'Select Your Language',
                'welcome.hindi': 'Hindi',
                'welcome.english': 'English',
                
                // Authentication
                'auth.welcomeBack': 'Welcome Back',
                'auth.signInToContinue': 'Sign in to continue managing your expenses',
                'auth.createAccount': 'Create Account',
                'auth.joinThousands': 'Join thousands managing their money smartly',
                'auth.email': 'Email Address',
                'auth.emailOrMobile': 'Enter email or mobile',
                'auth.emailPlaceholder': 'your@email.com or +91 98765 43210',
                'auth.password': 'Password',
                'auth.passwordPlaceholder': 'Your password',
                'auth.confirmPassword': 'Confirm Password',
                'auth.confirmPasswordPlaceholder': 'Re-enter your password',
                'auth.fullName': 'Full Name',
                'auth.fullNamePlaceholder': 'Enter your full name',
                'auth.mobileNumber': 'Mobile Number',
                'auth.mobilePlaceholder': '+91 98765 43210',
                'auth.createPassword': 'Create Password',
                'auth.passwordHint': 'Minimum 8 characters',
                'auth.agreeToTerms': 'I agree to the',
                'auth.termsAndConditions': 'Terms & Conditions',
                'auth.and': 'and',
                'auth.privacyPolicy': 'Privacy Policy',
                'auth.login': 'LOGIN',
                'auth.loggingIn': 'LOGGING IN...',
                'auth.signup': 'CREATE ACCOUNT',
                'auth.signingUp': 'CREATING ACCOUNT...',
                'auth.forgotPassword': 'Forgot Password?',
                'auth.or': 'or',
                'auth.continueWithGoogle': 'Continue with Google',
                'auth.dontHaveAccount': "Don't have an account?",
                'auth.alreadyHaveAccount': 'Already have an account?',
                'auth.signUpLink': 'Sign Up',
                'auth.loginLink': 'Login',
                
                // Dashboard
                'dashboard.title': 'Dashboard',
                'dashboard.totalBalance': 'Total Balance',
                'dashboard.thisMonth': 'this month',
                'dashboard.addExpense': 'Add Expense',
                'dashboard.voiceAdd': 'Voice Add',
                'dashboard.recentExpenses': 'Recent Expenses',
                'dashboard.activeGroups': 'Active Groups',
                'dashboard.noExpenses': 'No expenses yet',
                'dashboard.addFirstExpense': 'Add your first expense to get started!',
                'dashboard.noGroups': 'No groups yet',
                'dashboard.createOrJoinGroup': 'Create or join a group to get started!',
                'dashboard.members': 'members',
                'dashboard.remaining': 'remaining',
                'dashboard.spent': 'spent',
                'dashboard.saved': 'saved',
                
                // Expense Management
                'expense.add': 'Add Expense',
                'expense.edit': 'Edit Expense',
                'expense.amount': 'Amount',
                'expense.amountRupees': 'Amount (₹)',
                'expense.category': 'Category',
                'expense.selectCategory': 'Select Category',
                'expense.description': 'Description',
                'expense.descriptionOptional': 'Add description (optional)',
                'expense.date': 'Date',
                'expense.today': 'Today',
                'expense.addReceipt': 'Add receipt photo',
                'expense.clickPhoto': 'Click Photo',
                'expense.save': 'SAVE',
                'expense.saving': 'SAVING...',
                'expense.delete': 'Delete',
                'expense.cancel': 'Cancel',
                'expense.speakOrType': 'Speak or Type',
                'expense.whatDidYouBuy': 'What did you buy?',
                
                // Categories
                'category.food': 'Food',
                'category.transport': 'Transport',
                'category.teaCoffee': 'Tea/Coffee',
                'category.entertainment': 'Entertainment',
                'category.medical': 'Medical',
                'category.shopping': 'Shopping',
                'category.clothes': 'Clothes',
                'category.bills': 'Bills',
                'category.education': 'Education',
                'category.rent': 'Rent',
                'category.groceries': 'Groceries',
                'category.fuel': 'Fuel',
                'category.mobileRecharge': 'Mobile Recharge',
                'category.internet': 'Internet',
                'category.electricity': 'Electricity',
                'category.water': 'Water',
                'category.gas': 'Gas',
                'category.insurance': 'Insurance',
                'category.investment': 'Investment',
                'category.salary': 'Salary',
                'category.gift': 'Gift',
                'category.other': 'Other',
                
                // Groups
                'group.title': 'Groups',
                'group.create': 'Create Group',
                'group.totalFund': 'Total Fund',
                'group.totalSpent': 'Total Spent',
                'group.addExpense': 'Add Expense',
                'group.paidBy': 'Paid By',
                'group.splitAmong': 'Split Among',
                'group.whoWillShare': 'Who will share? Select:',
                'group.splitCalculation': 'Split Calculation',
                'group.whoOwesWhat': 'Who owes what',
                'group.sendReminders': 'Send Payment Reminders',
                'group.confirmSplit': 'CONFIRM SPLIT',
                'group.recentActivity': 'Recent Activity',
                
                // Navigation
                'nav.home': 'Home',
                'nav.analytics': 'Analytics',
                'nav.groups': 'Groups',
                'nav.profile': 'Profile',
                // Analytics
                'analytics.title': 'Analytics',
                'analytics.trends': 'Trends',
                'analytics.period': 'Period',
                'analytics.totalSpent': 'Total Spent',
                'analytics.totalIncome': 'Total Income',
                'analytics.savingsRate': 'Savings Rate',
                'analytics.categoryBreakdown': 'Category Breakdown',
                'analytics.topSpends': 'Top Spends',
                'analytics.groupPlaceholder': 'Group stats will appear here if you are part of any groups',
                'analytics.noData': 'No data',
                'analytics.download': 'Download',
                // Settings
                'settings.title': 'Settings',
                'settings.language': 'Language',
                'settings.changeLanguage': 'Change app language',
                
                // Common
                'common.loading': 'Loading...',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.back': 'Back',
                'common.next': 'Next',
                'common.done': 'Done',
                'common.confirm': 'Confirm',
                'common.yes': 'Yes',
                'common.no': 'No',
                'common.search': 'Search',
                
                // Errors
                'error.required': 'This field is required',
                'error.invalidEmail': 'Invalid email address',
                'error.passwordMismatch': 'Passwords do not match',
                'error.agreeToTerms': 'Please agree to the terms and conditions',
                'error.loginFailed': 'Login failed. Please try again.',
                'error.signupFailed': 'Signup failed. Please try again.',
                'error.generic': 'Something went wrong. Please try again.',
        },
        hi: {
                // Welcome & Branding
                'app.name': 'पैसाका ट्रैक',
                'app.tagline': 'आपका पैसा, आपका हिसाब',
                'app.taglineHindi': 'आपका पैसा, आपका हिसाब',
                'app.description': 'भारत का सबसे आसान खर्च ट्रैकर',
                'welcome.madeInIndia': 'भारत में ❤️ से बनाया गया',
                'welcome.selectLanguage': 'अपनी भाषा चुनें',
                'welcome.hindi': 'हिंदी',
                'welcome.english': 'English',
                
                // Authentication
                'auth.welcomeBack': 'वापसी पर स्वागत है',
                'auth.signInToContinue': 'अपने खर्चों को प्रबंधित करने के लिए साइन इन करें',
                'auth.createAccount': 'खाता बनाएं',
                'auth.joinThousands': 'हजारों लोगों के साथ जुड़ें जो स्मार्ट तरीके से पैसे प्रबंधित करते हैं',
                'auth.email': 'ईमेल पता',
                'auth.emailOrMobile': 'ईमेल या मोबाइल दर्ज करें',
                'auth.emailPlaceholder': 'your@email.com या +91 98765 43210',
                'auth.password': 'पासवर्ड',
                'auth.passwordPlaceholder': 'आपका पासवर्ड',
                'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
                'auth.confirmPasswordPlaceholder': 'अपना पासवर्ड फिर से दर्ज करें',
                'auth.fullName': 'पूरा नाम',
                'auth.fullNamePlaceholder': 'अपना पूरा नाम दर्ज करें',
                'auth.mobileNumber': 'मोबाइल नंबर',
                'auth.mobilePlaceholder': '+91 98765 43210',
                'auth.createPassword': 'पासवर्ड बनाएं',
                'auth.passwordHint': 'न्यूनतम 8 अक्षर',
                'auth.agreeToTerms': 'मैं सहमत हूं',
                'auth.termsAndConditions': 'नियम और शर्तें',
                'auth.and': 'और',
                'auth.privacyPolicy': 'गोपनीयता नीति',
                'auth.login': 'लॉगिन करें',
                'auth.loggingIn': 'लॉगिन हो रहा है...',
                'auth.signup': 'खाता बनाएं',
                'auth.signingUp': 'खाता बनाया जा रहा है...',
                'auth.forgotPassword': 'पासवर्ड भूल गए?',
                'auth.or': 'या',
                'auth.continueWithGoogle': 'Google से जारी रखें',
                'auth.dontHaveAccount': 'खाता नहीं है?',
                'auth.alreadyHaveAccount': 'पहले से खाता है?',
                'auth.signUpLink': 'साइन अप करें',
                'auth.loginLink': 'लॉगिन करें',
                
                // Dashboard
                'dashboard.title': 'डैशबोर्ड',
                'dashboard.totalBalance': 'कुल बैलेंस',
                'dashboard.thisMonth': 'इस महीने',
                'dashboard.addExpense': 'खर्च जोड़ें',
                'dashboard.voiceAdd': 'आवाज से जोड़ें',
                'dashboard.recentExpenses': 'हाल के खर्च',
                'dashboard.activeGroups': 'सक्रिय ग्रुप',
                'dashboard.noExpenses': 'अभी तक कोई खर्च नहीं',
                'dashboard.addFirstExpense': 'शुरू करने के लिए अपना पहला खर्च जोड़ें!',
                'dashboard.noGroups': 'अभी तक कोई ग्रुप नहीं',
                'dashboard.createOrJoinGroup': 'शुरू करने के लिए एक ग्रुप बनाएं या जुड़ें!',
                'dashboard.members': 'सदस्य',
                'dashboard.remaining': 'बचा हुआ',
                'dashboard.spent': 'खर्च किया',
                'dashboard.saved': 'बचत',
                
                // Expense Management
                'expense.add': 'खर्च जोड़ें',
                'expense.edit': 'खर्च संपादित करें',
                'expense.amount': 'राशि',
                'expense.amountRupees': 'राशि (₹)',
                'expense.category': 'श्रेणी',
                'expense.selectCategory': 'श्रेणी चुनें',
                'expense.description': 'विवरण',
                'expense.descriptionOptional': 'विवरण जोड़ें (वैकल्पिक)',
                'expense.date': 'तारीख',
                'expense.today': 'आज',
                'expense.addReceipt': 'रसीद फोटो जोड़ें',
                'expense.clickPhoto': 'फोटो क्लिक करें',
                'expense.save': 'सहेजें',
                'expense.saving': 'सहेजा जा रहा है...',
                'expense.delete': 'हटाएं',
                'expense.cancel': 'रद्द करें',
                'expense.speakOrType': 'बोलिए या लिखिए',
                'expense.whatDidYouBuy': 'आपने क्या खरीदा?',
                
                // Categories
                'category.food': 'भोजन',
                'category.transport': 'यातायात',
                'category.teaCoffee': 'चाय/कॉफी',
                'category.entertainment': 'मनोरंजन',
                'category.medical': 'चिकित्सा',
                'category.shopping': 'खरीदारी',
                'category.clothes': 'कपड़े',
                'category.bills': 'बिल',
                'category.education': 'शिक्षा',
                'category.rent': 'किराया',
                'category.groceries': 'किराना',
                'category.fuel': 'ईंधन',
                'category.mobileRecharge': 'मोबाइल रिचार्ज',
                'category.internet': 'इंटरनेट',
                'category.electricity': 'बिजली',
                'category.water': 'पानी',
                'category.gas': 'गैस',
                'category.insurance': 'बीमा',
                'category.investment': 'निवेश',
                'category.salary': 'वेतन',
                'category.gift': 'उपहार',
                'category.other': 'अन्य',
                
                // Groups
                'group.title': 'ग्रुप',
                'group.create': 'ग्रुप बनाएं',
                'group.totalFund': 'कुल फंड',
                'group.totalSpent': 'कुल खर्च',
                'group.addExpense': 'खर्च जोड़ें',
                'group.paidBy': 'भुगतान किया',
                'group.splitAmong': 'बांटें',
                'group.whoWillShare': 'कौन शेयर करेगा? चुनें:',
                'group.splitCalculation': 'विभाजन गणना',
                'group.whoOwesWhat': 'कौन किसको देता है',
                'group.sendReminders': 'भुगतान रिमाइंडर भेजें',
                'group.confirmSplit': 'विभाजन की पुष्टि करें',
                'group.recentActivity': 'हाल की गतिविधि',
                
                // Navigation
                'nav.home': 'होम',
                'nav.analytics': 'एनालिटिक्स',
                'nav.groups': 'ग्रुप',
                'nav.profile': 'प्रोफाइल',
                // Analytics
                'analytics.title': 'एनालिटिक्स',
                'analytics.trends': 'ट्रेंड्स',
                'analytics.period': 'अवधि',
                'analytics.totalSpent': 'कुल खर्च',
                'analytics.totalIncome': 'कुल आय',
                'analytics.savingsRate': 'बचत दर',
                'analytics.categoryBreakdown': 'श्रेणी अनुसार खर्च',
                'analytics.topSpends': 'ऊपर खर्च',
                'analytics.groupPlaceholder': 'यदि आप किसी समूह के सदस्य हैं तो समूह आँकड़े यहाँ दिखेंगे',
                'analytics.noData': 'डेटा नहीं है',
                'analytics.download': 'डाउनलोड',
                // Settings
                'settings.title': 'सेटिंग्स',
                'settings.language': 'भाषा',
                'settings.changeLanguage': 'ऐप भाषा बदलें',
                
                // Common
                'common.loading': 'लोड हो रहा है...',
                'common.save': 'सहेजें',
                'common.cancel': 'रद्द करें',
                'common.delete': 'हटाएं',
                'common.edit': 'संपादित करें',
                'common.back': 'वापस',
                'common.next': 'अगला',
                'common.done': 'हो गया',
                'common.confirm': 'पुष्टि करें',
                'common.yes': 'हां',
                'common.no': 'नहीं',
                'common.search': 'खोजें',
                
                // Errors
                'error.required': 'यह फील्ड आवश्यक है',
                'error.invalidEmail': 'अमान्य ईमेल पता',
                'error.passwordMismatch': 'पासवर्ड मेल नहीं खाते',
                'error.agreeToTerms': 'कृपया नियम और शर्तों से सहमत हों',
                'error.loginFailed': 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।',
                'error.signupFailed': 'साइन अप विफल रहा। कृपया पुनः प्रयास करें।',
                'error.generic': 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
        },
};

const LanguageContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
        // initialize from localStorage synchronously so UI doesn't flash
        const [lang, setLangState] = useState<Lang>(() => {
                try {
                        const saved = (typeof window !== 'undefined' && localStorage.getItem('paisaka_lang')) as Lang | null;
                        if (saved === 'en' || saved === 'hi') return saved;
                } catch (e) {
                        // ignore
                }
                return 'en';
        });

        // keep document <html lang=...> in sync for accessibility and SEO-ish clients
        // runs on client whenever language changes
        useEffect(() => {
                try {
                        document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
                } catch (e) {
                        // ignore (e.g., during SSR)
                }
        }, [lang]);

        const setLang = (l: Lang) => {
                setLangState(l);
                try { localStorage.setItem('paisaka_lang', l); } catch (e) { /* ignore */ }

                // TODO: Update user profile in Supabase with language preference
                // This will be implemented when user profile update is ready
        };
        
        const T = (key: string) => translations[lang][key] ?? key;
        
        return (
                <LanguageContext.Provider value={{ lang, setLang, T }}>
                        {children}
                </LanguageContext.Provider>
        );
}

export function useLanguage() {
        const ctx = useContext(LanguageContext);
        if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
        return ctx;
}