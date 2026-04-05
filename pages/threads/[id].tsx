import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import MessageList from '@/components/MessageList'
import AskDougForm from '@/components/AskDougForm'
import Head from 'next/head'

interface Message {
  id: string
  thread_id: string
  sender: string
  content: string
  created_at: string
}

interface Thread {
  id: string
  name: string
  created_at: string
}

export default function ThreadDetail() {
  const router = useRouter()
  const { id } = router.query
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [messageLoading, setMessageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    
    fetchThread()
    fetchMessages()
    fetchThreads()
    
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [id])

  const fetchThread = async () => {
    if (!id) return
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setThread(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchMessages = async () => {
    if (!id) return
    try {
      setMessageLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setMessageLoading(false)
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
      setError(err.message)
    }
  }

  const deleteThread = async (threadId: string) => {
    if (!confirm('このスレッドを削除しますか？')) return

    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', threadId)

      if (error) throw error
      await fetchThreads()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleMessageSent = () => {
    fetchMessages()
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

  if (!thread) {
    return (
      <div className="flex h-screen bg-shonan-white">
        <Sidebar threads={threads} onDelete={deleteThread} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-xl text-shonan-navy">スレッドが見つかりません</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{thread.name} - Rowly's Conversation Hub</title>
      </Head>
      <div className="flex h-screen bg-shonan-white">
        <Sidebar threads={threads} currentThreadId={id as string} onDelete={deleteThread} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Thread Header */}
            <div className="bg-shonan-gradient text-white px-6 py-4 shadow">
              <h2 className="text-2xl font-bold">{thread.name}</h2>
              <p className="text-sm opacity-90">
                {new Date(thread.created_at).toLocaleString('ja-JP')}
              </p>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-auto px-6 py-4">
              <MessageList messages={messages} />
            </div>

            {/* Ask Doug Form */}
            <div className="bg-white border-t-2 border-shonan-teal px-6 py-4 shadow">
              <AskDougForm threadId={id as string} onMessageSent={handleMessageSent} />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
