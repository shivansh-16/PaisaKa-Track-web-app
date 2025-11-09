'use client';

import { useEffect } from 'react';
import { subscribeToGroupExpenses } from '@/lib/realtime';

export default function GroupRealtimeSubscriber({ groupId }: { groupId: string }) {
	useEffect(() => {
		if (!groupId) return;
		const unsubscribe = subscribeToGroupExpenses(groupId, (payload: unknown) => {
			const p = payload as { eventType?: string; new?: { amount?: number } };
			window.dispatchEvent(new CustomEvent('group-expenses-changed', { detail: { groupId } }));
			if (p?.eventType === 'INSERT') {
				const amount = p?.new?.amount;
				window.dispatchEvent(new CustomEvent('toast', { detail: { message: `New group expense: ₹${Number(amount).toLocaleString()}` } }));
			}
		});
		return () => unsubscribe();
	}, [groupId]);
	return null;
}
