'use client'

import { useAuth } from './auth-provider'
import { useState } from 'react'
import { AuthModal } from '@/components/auth/auth-modal'

// MUI components
import { Button, Typography, Stack, Avatar, Menu, MenuItem, IconButton } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

export function UserMenu() {
  const { user, logout } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {user ? (
        <>
          <IconButton onClick={handleMenuClick} size="small" sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                minWidth: 180,
              },
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setModalOpen(true)}
        >
          Login / Register
        </Button>
      )}
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Stack>
  )
}
