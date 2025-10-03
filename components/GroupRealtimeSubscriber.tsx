'use client';

import { useEffect } from 'react';
import { subscribeToGroupExpenses } from '@/lib/realtime';

export default function GroupRealtimeSubscriber({ groupId }: { groupId: string }) {
	useEffect(() => {
		if (!groupId) return;
		const unsubscribe = subscribeToGroupExpenses(groupId, (payload: any) => {
			window.dispatchEvent(new CustomEvent('group-expenses-changed', { detail: { groupId } }));
			if (payload?.eventType === 'INSERT') {
				const amount = payload?.new?.amount;
				window.dispatchEvent(new CustomEvent('toast', { detail: { message: `New group expense: ₹${Number(amount).toLocaleString()}` } }));
			}
		});
		return () => unsubscribe();
	}, [groupId]);
	return null;
}
