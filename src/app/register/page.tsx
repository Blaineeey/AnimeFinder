'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) return setError(error.message)
    router.push('/login')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold">Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2" required />
        <button type="submit" className="bg-blue-600 text-white py-2">Register</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  )
}
