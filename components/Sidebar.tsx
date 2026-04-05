import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface Thread {
  id: string
  name: string
  created_at: string
}

interface SidebarProps {
  threads: Thread[]
  currentThreadId?: string
  onDelete: (id: string) => void
}

export default function Sidebar({ threads, currentThreadId, onDelete }: SidebarProps) {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <aside className="w-64 bg-shonan-dark text-white shadow-lg overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-shonan-navy">
        <Link href="/dashboard">
          <div className="text-center cursor-pointer hover:opacity-80 transition">
            <div className="text-3xl mb-2">🌊</div>
            <p className="font-bold text-shonan-sand">Rowly's Hub</p>
          </div>
        </Link>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-shonan-sand uppercase tracking-wide mb-3">
          スレッド
        </h3>
        
        {threads.length === 0 ? (
          <p className="text-xs text-gray-400">スレッドなし</p>
        ) : (
          <div className="space-y-2">
            {threads.map((thread) => (
              <div
                key={thread.id}
                onMouseEnter={() => setHoveredId(thread.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative p-3 rounded-lg cursor-pointer transition ${
                  currentThreadId === thread.id
                    ? 'bg-shonan-teal'
                    : 'hover:bg-shonan-navy'
                }`}
              >
                <Link
                  href={`/threads/${thread.id}`}
                  className="flex items-center gap-2 w-full"
                >
                  <span className="text-lg">💬</span>
                  <span className="flex-1 truncate text-sm font-medium">
                    {thread.name}
                  </span>
                </Link>
                
                {hoveredId === thread.id && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onDelete(thread.id)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-500 rounded transition"
                    title="削除"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-shonan-navy">
        <Link
          href="/settings"
          className="block text-center p-2 rounded-lg bg-shonan-teal hover:bg-shonan-navy transition font-semibold text-white text-sm"
        >
          ⚙️ 設定
        </Link>
      </div>
    </aside>
  )
}
