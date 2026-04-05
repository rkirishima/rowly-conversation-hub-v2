import { useEffect, useRef } from 'react'

interface Message {
  id: string
  thread_id: string
  sender: string
  content: string
  created_at: string
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <p className="text-2xl mb-2">💭</p>
          <p>まだメッセージはありません</p>
          <p className="text-sm">下の「Ask Doug」ボタンで質問を開始しましょう！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'Doug' ? 'justify-start' : 'justify-end'
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
              message.sender === 'Doug'
                ? 'bg-shonan-teal text-white'
                : 'bg-shonan-sand text-shonan-navy'
            }`}
          >
            <p className="text-xs font-semibold opacity-75 mb-1">
              {message.sender === 'Doug' ? '🤖 Doug' : '👤 You'}
            </p>
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <p
              className={`text-xs mt-2 opacity-60 ${
                message.sender === 'Doug'
                  ? 'text-white'
                  : 'text-shonan-navy'
              }`}
            >
              {new Date(message.created_at).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
