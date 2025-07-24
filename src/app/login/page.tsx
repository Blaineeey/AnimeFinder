'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return setError(error.message)
    router.push('/')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold">Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2" required />
        <button type="submit" className="bg-green-600 text-white py-2">Login</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  )
}
