import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div className="pk-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-600">Oops! The page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 inline-block px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold">Go Home</Link>
      </div>
    </div>
  );
}
