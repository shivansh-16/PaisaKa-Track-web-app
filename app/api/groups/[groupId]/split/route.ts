import { requireUser } from "@/lib/auth";
import { splitEqual, splitUnequal, splitPercentage, optimizeSettlements } from "@/lib/splitting";

export async function POST(req: Request, { params }: { params: { groupId: string } }) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const groupId = params.groupId;
	const body = await req.json().catch(() => null);
	if (!body || typeof body.totalAmount !== 'number' || !body.method) {
		return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
	}
	let shares;
	if (body.method === 'equal') {
		shares = splitEqual(body.totalAmount, body.participantIds || []);
	} else if (body.method === 'unequal') {
		shares = splitUnequal(body.assignments || [], body.totalAmount);
	} else if (body.method === 'percentage') {
		shares = splitPercentage(body.totalAmount, body.percentages || []);
	} else {
		return new Response(JSON.stringify({ error: 'Unknown method' }), { status: 400 });
	}
	// Build balances assuming payer paid full amount
	const balances: Record<string, number> = {};
	for (const s of shares) balances[s.userId] = (balances[s.userId] || 0) - s.amount;
	if (body.payerId) balances[body.payerId] = (balances[body.payerId] || 0) + body.totalAmount;
	const settlements = optimizeSettlements(balances);
	return new Response(JSON.stringify({ shares, settlements }), { status: 200 });
}
