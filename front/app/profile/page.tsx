'use client'

import {
  CalendarToday,
  Edit,
  Favorite,
  LocationOn,
  Person,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProfileEditModal from '@/components/layout/profile-edit-modal'

// デフォルトのプロフィールデータ（フォールバック用）
const defaultProfile = {
  name: 'ユーザー',
  email: '',
  joinDate: '2024-01-01',
  totalLikes: 0,
  visitedSpots: 0,
  avatar: '/placeholder.svg?height=100&width=100',
}

const likeHistory = [
  { id: 1, name: '隠れ茶屋 竹の庵', category: 'グルメ', date: '2024-01-15' },
  { id: 2, name: '夕日の展望台', category: '景観', date: '2024-01-10' },
  { id: 3, name: '古民家ギャラリー', category: '文化', date: '2024-01-05' },
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [userName, setUserName] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(defaultProfile)

  // セッションからユーザー情報を取得してプロフィールを更新
  useEffect(() => {
    if (session?.user) {
      const profile = {
        name: session.user.name || 'ユーザー',
        email: session.user.email || '',
        joinDate: '2024-01-01', // 実際のアプリではセッションから取得
        totalLikes: 15, // 実際のアプリではAPIから取得
        visitedSpots: 8, // 実際のアプリではAPIから取得
        avatar: session.user.image || '/placeholder.svg?height=100&width=100',
      }
      setUserProfile(profile)
      setUserName(profile.name)
    }
  }, [session])

  const handleSave = () => {
    setIsEditing(false)
    // ここで実際の保存処理を行う
  }

  // プロフィール編集後のコールバック
  const handleProfileUpdated = (newName: string) => {
    setUserProfile((prev) => ({
      ...prev,
      name: newName,
    }))
    setUserName(newName)
  }

  // ローディング状態
  if (status === 'loading') {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography>読み込み中...</Typography>
      </Container>
    )
  }

  // 未認証状態
  if (status === 'unauthenticated') {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography>ログインが必要です</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8">
        <Typography variant="h3" className="font-bold text-primary-500 mb-2">
          マイページ
        </Typography>
        <Typography color="text.secondary">
          プロフィール情報といいね履歴を管理できます
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* プロフィール情報 */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar
                src={userProfile.avatar || '/placeholder.svg'}
                alt={userProfile.name}
                className="w-24 h-24 mx-auto mb-4"
              >
                <Person className="text-4xl" />
              </Avatar>
              <Typography variant="h5" className="font-bold mb-1">
                {userProfile.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="mb-4"
              >
                {userProfile.email}
              </Typography>

              <Grid container spacing={2} className="mb-4">
                <Grid size={{ xs: 6 }}>
                  <Box className="text-center">
                    <Typography
                      variant="h4"
                      className="font-bold text-primary-500"
                    >
                      {userProfile.totalLikes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      いいね数
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box className="text-center">
                    <Typography
                      variant="h4"
                      className="font-bold text-primary-500"
                    >
                      {userProfile.visitedSpots}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      訪問スポット
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <CalendarToday className="text-sm" />
                <Typography variant="body2">
                  参加日: {userProfile.joinDate}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditModalOpen(true)}
                className="mt-4"
              >
                プロフィール編集
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* メインコンテンツ */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
              >
                <Tab label="プロフィール設定" />
                <Tab label="いいね履歴" />
              </Tabs>
            </Box>

            {/* プロフィール設定タブ */}
            {tabValue === 0 && (
              <CardContent className="p-6">
                <Box className="flex items-center justify-between mb-6">
                  <Typography variant="h6">ユーザー情報</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'キャンセル' : '編集'}
                  </Button>
                </Box>

                <Box className="space-y-4">
                  <TextField
                    fullWidth
                    label="ユーザー名"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={!isEditing}
                  />

                  <TextField
                    fullWidth
                    label="メールアドレス"
                    value={userProfile.email}
                    disabled
                    helperText="メールアドレスの変更はサポートまでお問い合わせください"
                  />

                  {isEditing && (
                    <Box className="flex gap-2 pt-4">
                      <Button variant="contained" onClick={handleSave}>
                        保存
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                      >
                        キャンセル
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            )}

            {/* いいね履歴タブ */}
            {tabValue === 1 && (
              <CardContent className="p-6">
                <Typography variant="h6" className="mb-2">
                  いいね履歴
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="mb-4"
                >
                  あなたがいいねしたスポットの履歴です
                </Typography>

                {likeHistory.length > 0 ? (
                  <List>
                    {likeHistory.map((item) => (
                      <ListItem
                        key={item.id}
                        className="border rounded-lg mb-2"
                      >
                        <ListItemIcon>
                          <Box className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
                            <LocationOn className="text-primary-500" />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography className="font-medium">
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box className="flex items-center gap-2 mt-1">
                              <Chip
                                label={item.category}
                                size="small"
                                variant="outlined"
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.date}
                              </Typography>
                            </Box>
                          }
                        />
                        <Favorite className="text-red-500" />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box className="text-center py-8">
                    <Favorite className="text-6xl text-gray-300 mb-4" />
                    <Typography color="text.secondary">
                      まだいいねしたスポットがありません
                    </Typography>
                  </Box>
                )}
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
      <ProfileEditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={session?.user || null}
        onUpdatedName={handleProfileUpdated}
      />
    </Container>
  )
}
