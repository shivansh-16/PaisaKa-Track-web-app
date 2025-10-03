'use client';

import { useEffect, useState } from 'react';

export default function Toast() {
	const [message, setMessage] = useState<string | null>(null);
	useEffect(() => {
		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail as { message: string } | undefined;
			setMessage(detail?.message || null);
			if (detail?.message) {
				const t = setTimeout(() => setMessage(null), 3000);
				return () => clearTimeout(t);
			}
		};
		window.addEventListener('toast', handler as EventListener);
		return () => window.removeEventListener('toast', handler as EventListener);
	}, []);
	if (!message) return null;
	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
			{message}
		</div>
	);
}
