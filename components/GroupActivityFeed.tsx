'use client';

import { useEffect, useState } from 'react';
import { subscribeToActivityFeed } from '@/lib/realtime';

interface ActivityItem {
	id: string;
	action: string;
	metadata: { amount?: number; description?: string };
	actor_id: string | null;
	created_at: string;
}

export default function GroupActivityFeed({ groupId }: { groupId: string }) {
	const [items, setItems] = useState<ActivityItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function fetchActivity() {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch(`/api/groups/${groupId}/activity`, { cache: 'no-store' });
			if (!res.ok) throw new Error(`Failed: ${res.status}`);
			const data = await res.json();
			setItems(data.items || []);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Error fetching activity');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!groupId) return;
		fetchActivity();
		const unsub = subscribeToActivityFeed(groupId, () => fetchActivity());
		return () => unsub();
	}, [groupId]);

	if (loading) return <div>Loading activity...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<ul className="space-y-2">
			{items.map((it) => (
				<li key={it.id} className="text-sm text-gray-700">
					<span className="mr-1">{new Date(it.created_at).toLocaleString()}:</span>
					{it.action === 'group_expense_created' ? (
						<span>New expense ₹{Number(it.metadata?.amount).toLocaleString()} — {it.metadata?.description || 'Expense'}</span>
					) : (
						<span>{it.action}</span>
					)}
				</li>
			))}
			{items.length === 0 && <li className="text-gray-500">No recent activity.</li>}
		</ul>
	);
}
