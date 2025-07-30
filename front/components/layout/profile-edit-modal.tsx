'use client'

import { Cancel, Close, Edit, Person, Save } from '@mui/icons-material'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface ProfileEditModalProps {
  open: boolean
  onClose: () => void
  onUpdatedName?: (name: string) => void
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    railsId?: number
  } | null
}

export default function ProfileEditModal({
  open,
  onClose,
  user,
  onUpdatedName,
}: ProfileEditModalProps) {
  const { update } = useSession()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Rails APIのベースURL
  const RAILS_API_URL = process.env.NEXT_PUBLIC_RAILS_API_URL + '/api/v1'

  // モーダルが開かれた時にユーザー情報を初期化
  useEffect(() => {
    if (open && user) {
      setDisplayName(user.name || '')
      setError(null)
      setSuccess(false)
    }
  }, [open, user])

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('表示名を入力してください')
      return
    }

    if (displayName.trim().length > 50) {
      setError('表示名は50文字以内で入力してください')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Rails APIにプロフィール更新リクエストを送信
      const response = await fetch(`${RAILS_API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email, // emailでユーザーを特定
          name: displayName.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Profile updated:', data)

        if (data.status === 'ok') {
          // NextAuthセッション更新(callbacksでtoken/sessionを反映させること)
          await update({ name: displayName.trim() })
          // 親のstateを更新(渡されていれば)
          onUpdatedName?.(displayName.trim())
          // サーバーコンポーネントで表示しているなら必要に応じて
          router.refresh()

          setSuccess(true)
          setTimeout(() => onClose(), 1500)
        } else {
          setError(
            data.errors
              ? data.errors.join(', ')
              : 'プロフィールの更新に失敗しました',
          )
        }
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.errors
          ? Array.isArray(errorData.errors)
            ? errorData.errors.join(', ')
            : errorData.errors
          : errorData.error || 'プロフィールの更新に失敗しました'
        setError(errorMessage)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setError('ネットワークエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setDisplayName(user?.name || '')
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'rounded-lg',
      }}
    >
      <DialogTitle className="flex items-center justify-between pb-2">
        <Box className="flex items-center gap-2">
          <Edit className="text-primary-500" />
          <Typography variant="h6" className="font-semibold">
            プロフィール編集
          </Typography>
        </Box>
        <IconButton onClick={handleCancel} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="space-y-6">
        {/* ユーザー情報表示 */}
        <Box className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Avatar
            src={user?.image || undefined}
            alt={user?.name || 'ユーザー'}
            className="w-16 h-16"
          >
            <Person className="text-2xl" />
          </Avatar>
          <Box>
            <Typography variant="body1" className="font-medium">
              {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Google アカウント
            </Typography>
          </Box>
        </Box>

        {/* エラー・成功メッセージ */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4">
            プロフィールをデータベースに保存しました！
          </Alert>
        )}

        {/* 編集フォーム */}
        <Box className="space-y-4">
          <TextField
            fullWidth
            label="表示名（ニックネーム）"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isLoading || success}
            placeholder="表示名を入力してください"
            helperText={`他のユーザーに表示される名前です（${displayName.length}/50文字）`}
            error={displayName.length > 50}
            InputProps={{
              startAdornment: <Person className="text-gray-400 mr-2" />,
            }}
          />

          <Box className="p-3 bg-blue-50 rounded-lg">
            <Typography variant="body2" color="text.secondary">
              <strong>注意:</strong>{' '}
              メールアドレスはGoogleアカウントと連携しているため変更できません。
              表示名の変更はデータベースに保存されます。
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="p-6 pt-0">
        <Button
          onClick={handleCancel}
          disabled={isLoading}
          startIcon={<Cancel />}
          className="text-gray-600"
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            isLoading ||
            success ||
            !displayName.trim() ||
            displayName.length > 50
          }
          startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
          className="bg-primary-500 hover:bg-primary-600"
        >
          {isLoading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
