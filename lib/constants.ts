export const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_PROJECT_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const SUPABASE_BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "paisaka-receipts";

export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || "INR";
export const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE || "Asia/Kolkata";
export const SUPPORTED_LANGUAGES = (process.env.SUPPORTED_LANGUAGES || "en,hi").split(",").map((s) => s.trim());

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
	if (value === undefined) return fallback;
	return value.toLowerCase() === "true" || value === "1";
}

function parseNumber(value: string | undefined, fallback: number): number {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

export const ANALYTICS_ENABLED = parseBoolean(process.env.ANALYTICS_ENABLED, true);
export const ERROR_REPORTING_ENABLED = parseBoolean(process.env.ERROR_REPORTING_ENABLED, true);
export const CACHE_TTL_SECONDS = parseNumber(process.env.CACHE_TTL_SECONDS, 300);
export const MAX_FILE_SIZE_MB = parseNumber(process.env.MAX_FILE_SIZE_MB, 10);
export const IMAGE_COMPRESSION_QUALITY = parseNumber(process.env.IMAGE_COMPRESSION_QUALITY, 0.8);

export const ALLOWED_FILE_TYPES = (process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/webp,application/pdf")
	.split(",")
	.map((t) => t.trim());

// Monetary limits (defaults): expressed in smallest currency units (Rupees)
// Defaults: 10 Crore (100,000,000) for expenses, 25 Crore (250,000,000) for incomes
export const MAX_EXPENSE_AMOUNT = parseNumber(process.env.MAX_EXPENSE_AMOUNT, 100_000_000);
export const MAX_INCOME_AMOUNT = parseNumber(process.env.MAX_INCOME_AMOUNT, 250_000_000);
