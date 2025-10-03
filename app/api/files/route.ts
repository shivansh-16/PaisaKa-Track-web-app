import { requireUser } from "@/lib/auth";
import { createSignedUploadPath, getSignedUploadUrl, getSignedDownloadUrl } from "@/lib/storage";

export async function POST(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const body = await req.json().catch(() => null);
	if (!body || typeof body.filename !== "string" || typeof body.contentType !== "string") {
		return new Response(JSON.stringify({ error: "filename and contentType required" }), { status: 400 });
	}
	const path = await createSignedUploadPath(user.id, body.filename);
	const signed = await getSignedUploadUrl(path, body.contentType);
	return new Response(JSON.stringify({ path, signedUrl: signed.signedUrl, token: signed.token }), { status: 200 });
}

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const url = new URL(req.url);
	const path = url.searchParams.get('path');
	if (!path) return new Response(JSON.stringify({ error: 'path required' }), { status: 400 });
	const signedUrl = await getSignedDownloadUrl(path);
	return new Response(JSON.stringify({ signedUrl }), { status: 200 });
}
