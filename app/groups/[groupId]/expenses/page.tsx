'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GroupRealtimeSubscriber from '@/components/GroupRealtimeSubscriber';

interface GroupExpense {
	id: string;
	group_id: string;
	payer_id: string;
	description: string | null;
	amount: number;
	currency: string;
	occurred_at: string;
	created_at: string;
}

export default function GroupExpensesPage() {
	const params = useParams();
	const groupId = params?.groupId as string;
	const [items, setItems] = useState<GroupExpense[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function fetchExpenses() {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch(`/api/groups/${groupId}/expenses`, { cache: 'no-store' });
			if (!res.ok) throw new Error(`Failed: ${res.status}`);
			const data = await res.json();
			setItems(data.items || []);
		} catch (e: any) {
			setError(e.message || 'Error fetching expenses');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (groupId) fetchExpenses();
	}, [groupId]);

	useEffect(() => {
		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (!detail || detail.groupId !== groupId) return;
			fetchExpenses();
		};
		window.addEventListener('group-expenses-changed', handler as EventListener);
		return () => window.removeEventListener('group-expenses-changed', handler as EventListener);
	}, [groupId]);

	return (
		<div className="px-4 py-6 space-y-4">
			<GroupRealtimeSubscriber groupId={groupId} />
			<h1 className="pk-section-title">Group Expenses</h1>
			{loading && <div>Loading...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<ul className="space-y-2">
					{items.map((exp) => (
						<li key={exp.id} className="flex items-center justify-between py-2 border-b">
							<div>
								<div className="font-medium">{exp.description || 'Expense'}</div>
								<div className="text-xs text-gray-500">{new Date(exp.occurred_at).toLocaleString()}</div>
							</div>
							<div className="pk-amount">₹{Number(exp.amount).toLocaleString()}</div>
						</li>
					))}
					{items.length === 0 && <li className="text-gray-500">No expenses yet.</li>}
				</ul>
			)}
		</div>
	);
}
