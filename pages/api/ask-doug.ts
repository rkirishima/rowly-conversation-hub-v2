import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

interface MessageBody {
  threadId: string
  question: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { threadId, question }: MessageBody = req.body

    if (!threadId || !question) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get the current user from the Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: Missing authorization header' })
    }

    // Extract the token from Authorization header (Bearer <token>)
    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Invalid authorization header' })
    }

    // Create a Supabase client with the user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    // Get the authenticated user from the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user || !user.id) {
      console.error('Auth error:', authError)
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
    }

    // Save the user question to database
    const { data: userMessage, error: userMsgError } = await supabase
      .from('messages')
      .insert([
        {
          thread_id: threadId,
          user_id: user.id,
          sender: 'User',
          content: question,
        },
      ])
      .select()

    if (userMsgError) {
      console.error('User message error:', userMsgError)
      throw userMsgError
    }

    // Call OpenClaw API (mock implementation)
    // In production, this would call the actual OpenClaw API
    let dougResponse = `こんにちは！あなたの質問「${question}」を受け取りました。\n\nこれはデモ応答です。本来ならここでOpenClaw APIから実際の回答が返ってきます。`

    try {
      // Attempt to call OpenClaw API if configured
      if (process.env.NEXT_PUBLIC_OPENCLAW_API_URL) {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_OPENCLAW_API_URL,
          { question },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENCLAW_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        )
        dougResponse = response.data.answer || dougResponse
      }
    } catch (apiError) {
      console.error('OpenClaw API error:', apiError)
      // Fall back to demo response
    }

    // Save Doug's response to database
    const { data: dougMessage, error: dougMsgError } = await supabase
      .from('messages')
      .insert([
        {
          thread_id: threadId,
          user_id: user.id,
          sender: 'Doug',
          content: dougResponse,
        },
      ])
      .select()

    if (dougMsgError) {
      console.error('Doug message error:', dougMsgError)
      throw dougMsgError
    }

    return res.status(200).json({
      success: true,
      userMessage: userMessage?.[0],
      dougMessage: dougMessage?.[0],
    })
  } catch (error: any) {
    console.error('Error in ask-doug:', error)
    return res.status(500).json({
      error: error.message || 'Internal server error',
    })
  }
}
