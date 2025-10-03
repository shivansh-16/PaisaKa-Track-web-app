'use client';

import { useParams } from 'next/navigation';
import GroupActivityFeed from '@/components/GroupActivityFeed';

export default function GroupPage() {
	const params = useParams();
	const groupId = params?.groupId as string;
	return (
		<div className="px-4 py-6 space-y-4">
			<h1 className="pk-section-title">Group</h1>
			<GroupActivityFeed groupId={groupId} />
		</div>
	);
}
