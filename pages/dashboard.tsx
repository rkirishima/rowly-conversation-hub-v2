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

export default function Dashboard() {
  const router = useRouter()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadName, setNewThreadName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchThreads()
    const interval = setInterval(fetchThreads, 2000)
    return () => clearInterval(interval)
  }, [])

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
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createThread = async () => {
    if (!newThreadName.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('threads')
        .insert([
          {
            user_id: user.id,
            name: newThreadName,
          },
        ])
        .select()

      if (error) throw error
      
      setNewThreadName('')
      setShowNewThread(false)
      await fetchThreads()
      
      if (data && data[0]) {
        router.push(`/threads/${data[0].id}`)
      }
    } catch (err: any) {
      setError(err.message)
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
      setError(err.message)
    }
  }

  return (
    <>
      <Head>
        <title>ダッシュボード - Rowly's Conversation Hub</title>
      </Head>
      <div className="flex h-screen bg-shonan-white">
        <Sidebar threads={threads} onDelete={deleteThread} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-shonan-navy">スレッド一覧</h1>
                <button
                  onClick={() => setShowNewThread(true)}
                  className="bg-shonan-teal hover:bg-shonan-navy text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  + 新規スレッド
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {showNewThread && (
                <div className="mb-6 p-6 bg-shonan-sand rounded-lg border-2 border-shonan-teal">
                  <input
                    type="text"
                    value={newThreadName}
                    onChange={(e) => setNewThreadName(e.target.value)}
                    placeholder="スレッド名を入力"
                    className="w-full px-4 py-2 border border-shonan-teal rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-shonan-navy"
                    onKeyPress={(e) => e.key === 'Enter' && createThread()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createThread}
                      className="flex-1 bg-shonan-teal text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                    >
                      作成
                    </button>
                    <button
                      onClick={() => {
                        setShowNewThread(false)
                        setNewThreadName('')
                      }}
                      className="flex-1 bg-gray-400 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-shonan-teal border-t-shonan-navy"></div>
                </div>
              ) : threads.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-shonan-navy mb-4">スレッドがありません</p>
                  <button
                    onClick={() => setShowNewThread(true)}
                    className="bg-shonan-teal text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition"
                  >
                    最初のスレッドを作成
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {threads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => router.push(`/threads/${thread.id}`)}
                      className="p-6 bg-white rounded-lg border-2 border-shonan-teal hover:shadow-lg cursor-pointer transition"
                    >
                      <h3 className="text-xl font-semibold text-shonan-navy mb-2">
                        💬 {thread.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(thread.created_at).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
