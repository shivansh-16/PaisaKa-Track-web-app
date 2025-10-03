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
		'welcome.title': 'Welcome',
		'auth.createAccount': 'Create Account',
		'dashboard.recentExpenses': 'Recent Expenses',
	},
	hi: {
		'welcome.title': 'स्वागत है',
		'auth.createAccount': 'खाता बनाएं',
		'dashboard.recentExpenses': 'हाल के खर्च',
	},
};

const LanguageContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [lang, setLangState] = useState<Lang>('en');
	useEffect(() => {
		const saved = localStorage.getItem('paisaka_lang') as Lang | null;
		if (saved === 'en' || saved === 'hi') setLangState(saved);
	}, []);
	const setLang = (l: Lang) => {
		setLangState(l);
		localStorage.setItem('paisaka_lang', l);
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
