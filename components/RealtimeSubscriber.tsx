'use client';

import { useEffect } from 'react';
import { subscribeToUserTransactions, subscribeToNotifications } from '@/lib/realtime';
import { useAuth } from '@/context/AuthContext';

export default function RealtimeSubscriber() {
	const { user } = useAuth();
	useEffect(() => {
		if (!user) return;
		const unsubTx = subscribeToUserTransactions(user.id, () => {
			window.dispatchEvent(new Event('expenses-changed'));
		});
		const unsubNotif = subscribeToNotifications(user.id, (payload: any) => {
			if (payload?.eventType === 'INSERT' && payload?.new?.type === 'budget_alert') {
				window.dispatchEvent(new CustomEvent('toast', { detail: { message: payload.new.message } }));
			}
		});
		return () => { unsubTx(); unsubNotif(); };
	}, [user]);
	return null;
}
