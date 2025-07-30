'use client'

import {
  Favorite,
  LocationOn,
  Menu as MenuIcon,
  Person,
  Search,
  ExitToApp,
} from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import ProfileEditModal from './profile-edit-modal'

export default function Header() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const { data: session } = useSession()
  const postedRef = useRef(false)

  useEffect(() => {
    if (session && !postedRef.current) {
      postedRef.current = true
      console.log('session:', session)
      fetch(process.env.NEXT_PUBLIC_RAILS_API_URL + '/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session.user?.name,
          email: session.user?.email,
          provider: 'google',
          uid: session.user?.email,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((t) => {
              throw new Error(t)
            })
          }
        })
        .catch((e) => {
          console.error('Rails API user保存失敗', e)
        })
    }
  }, [session])

  const navigationItems = [
    { label: 'スポット検索', href: '/spots', icon: <Search /> },
    { label: 'いいね一覧', href: '/likes', icon: <Favorite /> },
    { label: 'マイページ', href: '/profile', icon: <Person /> },
  ]

  const handleUserNameClick = () => {
    setProfileModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      <AppBar position="static" className="bg-primary-500 shadow-md">
        <Toolbar className="container mx-auto px-4">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline text-white"
          >
            <LocationOn className="text-3xl" />
            <Typography variant="h6" component="div" className="font-bold">
              kamakura-travel
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile ? (
            <Box className="flex items-center gap-6">
              {/* 認証済みユーザーのみナビゲーション表示 */}
              {session && (
                <>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-white hover:text-accent-300 transition-colors no-underline"
                    >
                      <Typography variant="body1">{item.label}</Typography>
                    </Link>
                  ))}
                </>
              )}

              {session ? (
                <Box className="flex items-center gap-3">
                  <Button
                    variant="text"
                    onClick={handleUserNameClick}
                    className="text-white hover:text-accent-300 normal-case p-1 min-w-0 hover:bg-white/10 rounded"
                  >
                    <Typography variant="body2" className="text-white">
                      {session.user?.name} さん
                    </Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSignOut}
                    startIcon={<ExitToApp />}
                    className="border-white text-white hover:bg-white hover:text-primary-500"
                  >
                    ログアウト
                  </Button>
                </Box>
              ) : (
                <Box className="flex items-center gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    color="inherit"
                    className="border border-white ml-4"
                    sx={{
                      color: '#fff',
                      borderColor: '#fff',
                      '&:hover': {
                        bgcolor: '#fff',
                        color: 'primary.main',
                        borderColor: '#fff',
                      },
                    }}
                    onClick={() => signIn('google')}
                  >
                    ログイン
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    className="bg-accent-500 text-accent-foreground hover:bg-accent-600"
                    onClick={() => signIn('google')}
                  >
                    新規登録
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <IconButton color="inherit" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* モバイルドロワー */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {session ? (
              <>
                <ListItem>
                  <Box className="flex flex-col w-full p-2">
                    <Typography variant="body1" className="font-medium">
                      {session.user?.name} さん
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.user?.email}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider />
                {navigationItems.map((item) => (
                  <ListItem
                    key={item.href}
                    component={Link}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Box className="flex items-center gap-3">
                      {item.icon}
                      <ListItemText primary={item.label} />
                    </Box>
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setProfileModalOpen(true)
                  }}
                >
                  <Box className="flex items-center gap-3">
                    <Person />
                    <ListItemText primary="プロフィール編集" />
                  </Box>
                </ListItem>
                <ListItem onClick={handleSignOut}>
                  <Box className="flex items-center gap-3">
                    <ExitToApp />
                    <ListItemText primary="ログアウト" />
                  </Box>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem onClick={() => signIn('google')}>
                  <ListItemText primary="ログイン" />
                </ListItem>
                <ListItem onClick={() => signIn('google')}>
                  <ListItemText primary="新規登録" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* プロフィール編集モーダル */}
      <ProfileEditModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={session?.user}
      />
    </>
  )
}
