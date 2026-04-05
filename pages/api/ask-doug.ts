import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

interface MessageBody {
  threadId: string
  question: string
}

interface OpenClawResponse {
  message?: string
  error?: string
  [key: string]: any
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
      console.error('[ask-doug] Auth error:', authError)
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
    }

    console.log(`[ask-doug] User ${user.id} asking: "${question}"`)

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
      console.error('[ask-doug] User message DB error:', userMsgError)
      throw userMsgError
    }

    console.log(`[ask-doug] User message saved to DB`)

    // Call OpenClaw Gateway API
    // Gateway running on Mac Mini at port 18789
    const openClawUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789/api/message'
    const openClawToken = process.env.OPENCLAW_API_TOKEN || 'ef6dc7bda51918c4076baef538f939d22e88f7093d798395'
    
    let dougResponse: string = ''
    let openClawError: string | null = null

    try {
      console.log(`[ask-doug] Calling OpenClaw Gateway at ${openClawUrl}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒タイムアウト

      const response = await fetch(openClawUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openClawToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          context: threadId,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`OpenClaw Gateway returned status ${response.status}`)
      }

      const data: OpenClawResponse = await response.json()
      dougResponse = data.message || data.error || 'No response from OpenClaw'
      
      console.log(`[ask-doug] OpenClaw Gateway responded successfully`)
    } catch (apiError: any) {
      console.error(`[ask-doug] OpenClaw Gateway error:`, apiError.message)
      openClawError = apiError.message
      
      // Return error response
      return res.status(503).json({
        error: `Failed to connect to OpenClaw Gateway: ${apiError.message}`,
        details: 'Please ensure OpenClaw gateway is running on http://localhost:8000',
      })
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
      console.error('[ask-doug] Doug message DB error:', dougMsgError)
      throw dougMsgError
    }

    console.log(`[ask-doug] Doug's response saved to DB`)

    return res.status(200).json({
      success: true,
      userMessage: userMessage?.[0],
      dougMessage: dougMessage?.[0],
    })
  } catch (error: any) {
    console.error('[ask-doug] Unexpected error:', error)
    return res.status(500).json({
      error: error.message || 'Internal server error',
      details: 'An unexpected error occurred while processing your request',
    })
  }
}
