import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Head from 'next/head'

interface Thread {
  id: string
  name: string
  created_at: string
}

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
    fetchThreads()
  }, [])

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchThreads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setThreads(data || [])
    } catch (err: any) {
      console.error(err.message)
    }
  }

  const deleteThread = async (id: string) => {
    if (!confirm('このスレッドを削除しますか？')) return

    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchThreads()
    } catch (err: any) {
      console.error(err.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-shonan-white">
        <Sidebar threads={threads} onDelete={deleteThread} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-shonan-teal border-t-shonan-navy"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>設定 - Rowly's Conversation Hub</title>
      </Head>
      <div className="flex h-screen bg-shonan-white">
        <Sidebar threads={threads} onDelete={deleteThread} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-shonan-navy mb-8">⚙️ 設定</h1>

              <div className="bg-white rounded-lg border-2 border-shonan-teal p-8 shadow">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-shonan-navy mb-4">
                    アカウント情報
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        メールアドレス
                      </label>
                      <p className="text-lg text-shonan-navy font-semibold">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        ユーザーID
                      </label>
                      <p className="text-sm text-gray-500 font-mono break-all">
                        {user?.id}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-shonan-sand" />

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-shonan-navy mb-4">
                    アプリ情報
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>名前:</strong> Rowly's Conversation Hub
                    </p>
                    <p>
                      <strong>バージョン:</strong> 1.0.0
                    </p>
                    <p>
                      <strong>テック:</strong> Next.js 14 + Supabase + Tailwind CSS
                    </p>
                  </div>
                </div>

                <hr className="my-8 border-shonan-sand" />

                <div className="flex gap-4">
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    ログアウト
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 bg-shonan-teal hover:bg-shonan-navy text-white font-semibold py-3 rounded-lg transition"
                  >
                    ダッシュボードへ
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
