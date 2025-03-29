import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as Ably from "npm:ably@1.2.39"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  try {
    const ABLY_API_KEY = process.env.ABLY_API_KEY
    if (!ABLY_API_KEY) {
      throw new Error('ABLY_API_KEY is not set')
    }

    const client = new Ably.Rest(ABLY_API_KEY)
    const tokenRequest = await client.auth.createTokenRequest()

    return new Response(
      JSON.stringify({ token: tokenRequest }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
