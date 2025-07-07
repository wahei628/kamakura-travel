'use client'

import { LocationOn, OpenInNew } from '@mui/icons-material'
import { Box, Card, Typography, Button, Alert } from '@mui/material'
import {
  generateGoogleMapsEmbedUrl,
  generateGoogleMapsSearchUrl,
  type MapLocation,
} from '@/lib/google-maps'

interface GoogleMapsIframeProps {
  location: MapLocation
  spotName?: string
  address?: string
  height?: string
  zoom?: number
  showOpenButton?: boolean
}

export default function GoogleMapsIframe({
  location,
  spotName,
  address,
  height = '300px',
  zoom = 16,
  showOpenButton = true,
}: GoogleMapsIframeProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // APIキーが設定されていない場合の表示
  if (!apiKey) {
    return (
      <Card className="p-6">
        <Alert severity="warning" className="mb-4">
          Google Maps APIキーが設定されていません
        </Alert>
        <Box className="bg-secondary-50 h-64 flex items-center justify-center">
          <Box className="text-center text-gray-600">
            <LocationOn className="text-6xl mb-2" />
            <Typography variant="h6">地図を表示するには</Typography>
            <Typography variant="body2">
              Google Maps APIキーの設定が必要です
            </Typography>
          </Box>
        </Box>
      </Card>
    )
  }

  // 埋め込みURLを生成（スポット名がある場合は検索、ない場合は座標表示）
  const embedUrl = spotName
    ? generateGoogleMapsSearchUrl(spotName, location)
    : generateGoogleMapsEmbedUrl(location, zoom)

  // Google Mapsで開くURL
  const openInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`

  return (
    <Card className="overflow-hidden">
      <Box className="relative">
        <iframe
          src={embedUrl}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={spotName ? `${spotName}の地図` : '地図'}
        />

        {/* Google Mapsで開くボタン */}
        {showOpenButton && (
          <Button
            variant="contained"
            size="small"
            startIcon={<OpenInNew />}
            className="absolute top-2 right-2 bg-white text-primary-500 hover:bg-gray-50 shadow-md"
            onClick={() => window.open(openInMapsUrl, '_blank')}
            sx={{
              minWidth: 'auto',
              padding: '4px 8px',
              fontSize: '12px',
            }}
          >
            開く
          </Button>
        )}
      </Box>

      {/* 住所表示 */}
      {address && (
        <Box className="p-3 bg-gray-50 border-t">
          <Box className="flex items-start gap-2">
            <LocationOn className="text-gray-400 mt-0.5" fontSize="small" />
            <Box>
              <Typography variant="body2" className="font-medium">
                住所
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {address}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Card>
  )
}
