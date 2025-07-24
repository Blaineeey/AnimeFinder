// src/components/auth/auth-modal.tsx
'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import { useState } from 'react'
import { useAuth } from './auth-provider'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegister) {
      await register(email, password)
    } else {
      await login(email, password)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{isRegister ? 'Register' : 'Login'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <DialogActions sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </DialogActions>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {isRegister ? (
            <>
              Already have an account?{' '}
              <Button onClick={() => setIsRegister(false)} size="small">
                Login
              </Button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <Button onClick={() => setIsRegister(true)} size="small">
                Register
              </Button>
            </>
          )}
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
