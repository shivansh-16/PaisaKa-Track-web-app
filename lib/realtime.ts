import { getBrowserSupabase } from "./db";

export type RealtimeCallback<T = unknown> = (payload: T) => void;

const channelCache = new Map<string, { unsubscribe: () => void; listeners: Set<RealtimeCallback> }>();

function getOrCreateChannel(key: string, table: string, filter: string) {
	const existing = channelCache.get(key);
	if (existing) return existing;
	const supabase = getBrowserSupabase();
	const listeners = new Set<RealtimeCallback>();
	const channel = supabase
		.channel(key)
		.on('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) => {
			listeners.forEach((cb) => cb(payload));
		})
		.subscribe();
	const value = {
		unsubscribe: () => {
			supabase.removeChannel(channel);
			channelCache.delete(key);
		},
		listeners,
	};
	channelCache.set(key, value);
	return value;
}

export function subscribeToUserTransactions(userId: string, onChange: RealtimeCallback) {
	const key = `transactions_user_${userId}`;
	const chan = getOrCreateChannel(key, 'transactions', `user_id=eq.${userId}`);
	chan.listeners.add(onChange);
	return () => {
		chan.listeners.delete(onChange);
		if (chan.listeners.size === 0) chan.unsubscribe();
	};
}

export function subscribeToGroupExpenses(groupId: string, onChange: RealtimeCallback) {
	const key = `group_expenses_${groupId}`;
	const chan = getOrCreateChannel(key, 'group_expenses', `group_id=eq.${groupId}`);
	chan.listeners.add(onChange);
	return () => {
		chan.listeners.delete(onChange);
		if (chan.listeners.size === 0) chan.unsubscribe();
	};
}

export function subscribeToActivityFeed(groupId: string, onChange: RealtimeCallback) {
	const key = `activity_feed_${groupId}`;
	const chan = getOrCreateChannel(key, 'activity_feed', `group_id=eq.${groupId}`);
	chan.listeners.add(onChange);
	return () => {
		chan.listeners.delete(onChange);
		if (chan.listeners.size === 0) chan.unsubscribe();
	};
}

export function subscribeToNotifications(userId: string, onChange: RealtimeCallback) {
	const key = `notifications_${userId}`;
	const chan = getOrCreateChannel(key, 'notifications', `user_id=eq.${userId}`);
	chan.listeners.add(onChange);
	return () => {
		chan.listeners.delete(onChange);
		if (chan.listeners.size === 0) chan.unsubscribe();
	};
}
