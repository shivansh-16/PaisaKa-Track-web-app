import { getServerSupabase } from './db';
import { SUPABASE_BUCKET_NAME, MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from './constants';

export async function createSignedUploadPath(userId: string, filename: string) {
	const ext = filename.split('.').pop() || 'bin';
	const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
	return path;
}

export async function getSignedUploadUrl(path: string, contentType: string) {
	if (!ALLOWED_FILE_TYPES.includes(contentType)) {
		throw new Error('File type not allowed');
	}
	const supabase = getServerSupabase();
	const { data, error } = await supabase.storage
		.from(SUPABASE_BUCKET_NAME)
		.createSignedUploadUrl(path, { contentType, upsert: true });
	if (error) throw error;
	return data;
}

export async function getSignedDownloadUrl(path: string, expiresIn = 60 * 10) {
	const supabase = getServerSupabase();
	const { data, error } = await supabase.storage
		.from(SUPABASE_BUCKET_NAME)
		.createSignedUrl(path, expiresIn);
	if (error) throw error;
	return data.signedUrl;
}
