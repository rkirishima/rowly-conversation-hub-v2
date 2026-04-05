import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()

  return (
    <header className="bg-shonan-gradient text-white shadow-lg">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌊</span>
          <h1 className="text-2xl font-bold">Rowly's Hub</h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`font-semibold hover:text-shonan-sand transition ${
              router.pathname === '/dashboard' ? 'text-shonan-sand' : 'text-white'
            }`}
          >
            ダッシュボード
          </Link>
          <Link
            href="/settings"
            className={`font-semibold hover:text-shonan-sand transition ${
              router.pathname === '/settings' ? 'text-shonan-sand' : 'text-white'
            }`}
          >
            ⚙️ 設定
          </Link>
        </nav>
      </div>
    </header>
  )
}
