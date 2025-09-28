import Link from "next/link";

export default function HiWelcome() {
  return (
    <>
        <header className="flex items-center p-2 m-2 ">
          <a href="/welcome" className="p-2 rounded-full shadow-sm border px-3" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
            ←
          </a>
        </header>

      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--pk-bg)' }}>

        <div className="flex flex-col items-center justify-center gap-6 max-w-md w-full space-y-8">
          {/* App Logo and Branding */}
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl" style={{ background: 'var(--pk-orange)' }}>
              ₹
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--pk-text-primary)' }}>PaisaKa Track</h1>
              <p className="text-lg" style={{ color: 'var(--pk-text-secondary)' }}>आपका पैसा, आपका हिसाब</p>
            </div>
          </div>

          {/* Tagline */}
          {/* <div className="space-y-2">
          <p className="text-xl font-semibold" style={{ color: 'var(--pk-text-primary)' }}>
            "भारत का सबसे आसान Finance App"
          </p>
          <p className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>
            Personal & Group Expense Management
          </p>
        </div> */}

          {/* Action Buttons */}
          <div className="space-y-4 w-full p-2 mx-4">
            <Link href="/login" className="pk-button-primary w-full text-lg">
              📱 मोबाइल से शुरू करें
            </Link>
            <Link href="/login" className="pk-button-secondary w-full text-lg">
              📧 Email से Login
            </Link>
            <Link href="/signup" className="pk-button-warning w-full text-lg">
              🔐 नया Account
            </Link>
          </div>

          {/* Footer */}
          <div className="pt-8">
            <p className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
