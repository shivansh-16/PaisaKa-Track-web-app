'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Protected({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) router.replace('/welcome');
	}, [isLoading, user, router]);

	if (isLoading) return null;
	if (!user) return null;
	return <>{children}</>;
}
