import { useState } from 'react'
import axios from 'axios'
import { supabase } from '@/lib/supabase'

interface AskDougFormProps {
  threadId: string
  onMessageSent: () => void
}

export default function AskDougForm({ threadId, onMessageSent }: AskDougFormProps) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) return

    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('認証が必要です')
      }

      const response = await axios.post('/api/ask-doug', {
        threadId,
        question,
      }, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (response.data.success) {
        setQuestion('')
        onMessageSent()
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Doug... (何かお聞きになりたいことはありますか？)"
          className="flex-1 px-4 py-3 border-2 border-shonan-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-shonan-navy text-shonan-navy"
          disabled={loading}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-6 py-3 bg-shonan-teal hover:bg-shonan-navy text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? '送信中...' : '📨 Ask Doug'}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 text-right">
        {question.length}/500
      </p>
    </form>
  )
}
