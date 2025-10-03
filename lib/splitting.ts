export type ParticipantShare = { userId: string; amount: number };

export function splitEqual(totalAmount: number, participantIds: string[]): ParticipantShare[] {
	if (participantIds.length === 0) return [];
	const base = Math.floor((totalAmount * 100) / participantIds.length);
	let remainder = (totalAmount * 100) - base * participantIds.length;
	return participantIds.map((userId) => {
		const add = remainder > 0 ? 1 : 0;
		remainder -= add;
		return { userId, amount: (base + add) / 100 };
	});
}

export function splitUnequal(assignments: ParticipantShare[], totalAmount?: number): ParticipantShare[] {
	const sum = assignments.reduce((s, a) => s + a.amount, 0);
	if (totalAmount !== undefined && Math.abs(sum - totalAmount) > 0.01) {
		throw new Error('Unequal split does not sum to total');
	}
	return assignments;
}

export function splitPercentage(totalAmount: number, percentages: { userId: string; percent: number }[]): ParticipantShare[] {
	const sum = percentages.reduce((s, p) => s + p.percent, 0);
	if (Math.abs(sum - 100) > 0.001) throw new Error('Percentages must sum to 100');
	let centsRemaining = Math.round(totalAmount * 100);
	const results = percentages.map((p) => {
		const cents = Math.floor((p.percent / 100) * totalAmount * 100);
		centsRemaining -= cents;
		return { userId: p.userId, amount: cents / 100 };
	});
	// Distribute leftover cents
	for (let i = 0; centsRemaining > 0 && i < results.length; i += 1) {
		results[i].amount = Math.round(results[i].amount * 100 + 1) / 100;
		centsRemaining -= 1;
	}
	return results;
}

export type Settlement = { fromUserId: string; toUserId: string; amount: number };

export function optimizeSettlements(balances: Record<string, number>): Settlement[] {
	// Positive balance: others owe this user; Negative: this user owes others
	const creditors: { userId: string; amount: number }[] = [];
	const debtors: { userId: string; amount: number }[] = [];
	for (const [userId, amount] of Object.entries(balances)) {
		if (amount > 0.009) creditors.push({ userId, amount });
		else if (amount < -0.009) debtors.push({ userId, amount: -amount });
	}
	creditors.sort((a, b) => b.amount - a.amount);
	debtors.sort((a, b) => b.amount - a.amount);
	const settlements: Settlement[] = [];
	let i = 0, j = 0;
	while (i < creditors.length && j < debtors.length) {
		const pay = Math.min(creditors[i].amount, debtors[j].amount);
		settlements.push({ fromUserId: debtors[j].userId, toUserId: creditors[i].userId, amount: round2(pay) });
		creditors[i].amount = round2(creditors[i].amount - pay);
		debtors[j].amount = round2(debtors[j].amount - pay);
		if (creditors[i].amount <= 0.009) i += 1;
		if (debtors[j].amount <= 0.009) j += 1;
	}
	return settlements;
}

function round2(x: number) { return Math.round(x * 100) / 100; }
