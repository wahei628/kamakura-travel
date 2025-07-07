'use client'

import {
  Search,
  LocationOn,
  Favorite,
  FilterList,
  Map,
  Close,
} from '@mui/icons-material'
import {
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Rating,
  IconButton,
  Fab,
  Drawer,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import InteractiveMap from '@/components/layout/interactive-map'
import {
  mockSpotLocations,
  calculateDistance,
  formatDistance,
  KAMAKURA_CENTER,
  type SpotLocation,
} from '@/lib/google-maps'

export default function SpotsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全て')
  const [selectedSpot, setSelectedSpot] = useState<SpotLocation | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [userLocation] = useState(KAMAKURA_CENTER)

  const categories = ['全て', 'グルメ', '景観', '文化', '歴史', '自然']

  // フィルタリングされたスポット
  const filteredSpots = mockSpotLocations.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === '全て' || spot.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 距離を計算してソート
  const spotsWithDistance = filteredSpots
    .map((spot) => ({
      ...spot,
      distance: calculateDistance(userLocation, spot),
    }))
    .sort((a, b) => a.distance - b.distance)

  const handleSpotSelect = (spot: SpotLocation) => {
    setSelectedSpot(spot)
  }

  return (
    <Container maxWidth="lg" className="py-8">
      {/* インタラクティブマップ */}
      <Box className="mb-8">
        <InteractiveMap
          selectedSpot={selectedSpot}
          onSpotSelect={handleSpotSelect}
          height="400px"
          showControls={true}
        />
      </Box>

      {/* 検索バー */}
      <Box className="mb-8">
        <Grid container spacing={2} className="mb-4">
          <Grid size={{ xs: 12, md: 10 }}>
            <TextField
              fullWidth
              placeholder="スポット名やキーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="bg-white"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<FilterList />}
              className="h-full border-primary-300 text-primary-600 hover:bg-primary-50"
            >
              フィルター
            </Button>
          </Grid>
        </Grid>

        {/* カテゴリータブ */}
        <Box className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              color={selectedCategory === category ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(category)}
              className="cursor-pointer whitespace-nowrap"
            />
          ))}
        </Box>
      </Box>

      {/* 検索結果ヘッダー */}
      <Box className="mb-6">
        <Typography
          variant="h5"
          className="font-semibold text-primary-500 mb-2"
        >
          検索結果
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {spotsWithDistance.length}件のスポットが見つかりました
          {selectedSpot && (
            <Chip
              label={`選択中: ${selectedSpot.name}`}
              onDelete={() => setSelectedSpot(null)}
              className="ml-2"
              color="primary"
              variant="outlined"
            />
          )}
        </Typography>
      </Box>

      {/* 検索結果 */}
      <Grid container spacing={3}>
        {spotsWithDistance.map((spot) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={spot.id}>
            <Card
              className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                selectedSpot?.id === spot.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => handleSpotSelect(spot)}
            >
              <Box className="relative">
                <CardMedia component="div" className="h-48 relative">
                  <Image
                    src={spot.image || '/placeholder.svg'}
                    alt={spot.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </CardMedia>
                <IconButton className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md">
                  <Favorite className="text-gray-400" />
                </IconButton>
                <Chip
                  label={spot.category}
                  size="small"
                  className="absolute top-2 left-2 bg-white/90 font-medium"
                />
              </Box>
              <CardContent className="p-4">
                <Typography
                  variant="h6"
                  className="font-semibold mb-2 line-clamp-1"
                >
                  {spot.name}
                </Typography>
                <Box className="flex items-center gap-2 mb-2">
                  <Rating
                    value={spot.rating}
                    precision={0.1}
                    size="small"
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    {spot.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Box className="flex items-center gap-1">
                    <LocationOn className="text-gray-400" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDistance(spot.distance)}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="mb-4 line-clamp-2"
                >
                  {spot.description}
                </Typography>
                <Box className="flex justify-between items-center">
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSpotSelect(spot)
                    }}
                    variant={
                      selectedSpot?.id === spot.id ? 'contained' : 'outlined'
                    }
                  >
                    地図で表示
                  </Button>
                  <Button
                    size="small"
                    component={Link}
                    href={`/spots/${spot.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    詳細を見る
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 結果が見つからない場合 */}
      {spotsWithDistance.length === 0 && (
        <Box className="text-center py-16">
          <Search className="text-6xl text-gray-300 mb-4" />
          <Typography variant="h6" className="font-semibold text-gray-600 mb-2">
            検索結果が見つかりませんでした
          </Typography>
          <Typography color="text.secondary" className="mb-6">
            検索条件を変更して再度お試しください
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('全て')
              setSelectedSpot(null)
            }}
          >
            検索条件をリセット
          </Button>
        </Box>
      )}

      {/* モバイル用地図表示ボタン */}
      <Fab
        color="primary"
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 md:hidden"
        onClick={() => setShowMap(true)}
      >
        <Map />
      </Fab>

      {/* モバイル用地図ドロワー */}
      <Drawer
        anchor="bottom"
        open={showMap}
        onClose={() => setShowMap(false)}
        PaperProps={{
          sx: { height: '80vh' },
        }}
      >
        <Box className="p-4 h-full flex flex-col">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6">地図</Typography>
            <IconButton onClick={() => setShowMap(false)}>
              <Close />
            </IconButton>
          </Box>
          <Box className="flex-1">
            <InteractiveMap
              selectedSpot={selectedSpot}
              onSpotSelect={handleSpotSelect}
              height="100%"
              showControls={true}
            />
          </Box>
        </Box>
      </Drawer>
    </Container>
  )
}
