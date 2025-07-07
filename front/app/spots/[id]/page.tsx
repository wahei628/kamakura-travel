'use client'

import {
  Favorite,
  LocationOn,
  AccessTime,
  Phone,
  Share,
  Star,
  Person,
} from '@mui/icons-material'
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import GoogleMapsIframe from '@/components/layout/google-maps-iframe'
import { mockSpotLocations } from '@/lib/google-maps'

// モックデータ（実際の実装では[id]パラメータを使用）
const spotData = {
  id: 1,
  name: '隠れ茶屋 竹の庵',
  category: 'グルメ',
  description:
    '竹林の奥にある秘密の茶屋。地元の人だけが知る絶品の抹茶スイーツが楽しめます。築80年の古民家を改装した店内は、静寂に包まれた特別な空間。季節ごとに変わる和菓子と、丁寧に点てられた抹茶の組み合わせは格別です。店主の心のこもったおもてなしと、時間を忘れさせてくれる雰囲気が多くの人に愛され続けています。',
  images: [
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
    '/placeholder.svg?height=300&width=400',
  ],
  likes: 24,
  rating: 4.8,
  reviews: 12,
  address: '神奈川県鎌倉市山ノ内123-45',
  phone: '0467-12-3456',
  hours: '10:00-17:00（火曜定休）',
  access: '北鎌倉駅から徒歩15分、竹林の小道を奥へ進んだ先',
  tags: ['隠れ家', '抹茶', '古民家', '静寂', '和菓子'],
  price: '¥1,000-2,000',
  website: 'https://example.com',
  location: {
    lat: 35.3367,
    lng: 139.5468,
  },
}

const mockReviews = [
  {
    id: 1,
    user: '山田花子',
    avatar: '/placeholder.svg?height=40&width=40',
    rating: 5,
    date: '2024-01-15',
    comment:
      '本当に隠れた名店でした！抹茶の味が深くて、和菓子との相性も抜群。静かな環境でゆっくりできます。',
  },
  {
    id: 2,
    user: '佐藤太郎',
    avatar: '/placeholder.svg?height=40&width=40',
    rating: 4,
    date: '2024-01-10',
    comment:
      '竹林を抜けた先にある素敵なお店。少し分かりにくい場所ですが、それがまた特別感を演出しています。',
  },
]

export default function SpotDetailPage() {
  return (
    <Container maxWidth="lg" className="py-8">
      <Grid container spacing={4}>
        {/* メイン情報 */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box className="space-y-6">
            {/* 画像ギャラリー */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card className="relative h-64 md:h-80 overflow-hidden">
                  <Image
                    src={spotData.images[0] || '/placeholder.svg'}
                    alt={spotData.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Grid container spacing={1}>
                  {spotData.images.slice(1, 4).map((image, index) => (
                    <Grid size={{ xs: 12, lg: 8 }} key={index}>
                      <Card className="relative h-20 md:h-24 overflow-hidden">
                        <Image
                          src={image || '/placeholder.svg'}
                          alt={`${spotData.name} ${index + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 25vw"
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {/* スポット情報 */}
            <Card>
              <CardContent className="p-6">
                <Box className="flex justify-between items-start mb-4">
                  <Box>
                    <Typography variant="h4" className="font-bold mb-2">
                      {spotData.name}
                    </Typography>
                    <Box className="flex items-center gap-4 mb-2">
                      <Box className="flex items-center gap-1">
                        <Rating
                          value={spotData.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary">
                          {spotData.rating} ({spotData.reviews}件のレビュー)
                        </Typography>
                      </Box>
                      <Chip label={spotData.category} color="secondary" />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-2"
                    >
                      価格帯: {spotData.price}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Favorite />}
                    className="flex-shrink-0"
                  >
                    {spotData.likes}
                  </Button>
                </Box>

                <Typography className="text-gray-700 leading-relaxed mb-4 text-lg">
                  {spotData.description}
                </Typography>

                <Box className="flex flex-wrap gap-2">
                  {spotData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Google Maps iframe */}
            <Card>
              <CardContent className="p-6">
                <Typography
                  variant="h6"
                  className="flex items-center gap-2 mb-4"
                >
                  <LocationOn />
                  アクセス・地図
                </Typography>
                <GoogleMapsIframe
                  location={spotData.location}
                  spotName={spotData.name}
                  address={spotData.address}
                  height="350px"
                  zoom={16}
                  showOpenButton={true}
                />
                <Box className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <Typography variant="body1" className="font-medium mb-2">
                    アクセス方法
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="leading-relaxed"
                  >
                    {spotData.access}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* レビューセクション */}
            <Card>
              <CardContent className="p-6">
                <Typography variant="h6" className="mb-4">
                  レビュー ({mockReviews.length}件)
                </Typography>
                <Box className="space-y-4">
                  {mockReviews.map((review) => (
                    <Box key={review.id}>
                      <Box className="flex items-start gap-3">
                        <Avatar
                          src={review.avatar}
                          alt={review.user}
                          className="w-10 h-10"
                        >
                          <Person />
                        </Avatar>
                        <Box className="flex-1">
                          <Box className="flex items-center gap-2 mb-1">
                            <Typography variant="body1" className="font-medium">
                              {review.user}
                            </Typography>
                            <Rating
                              value={review.rating}
                              size="small"
                              readOnly
                            />
                            <Typography variant="body2" color="text.secondary">
                              {review.date}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {review.comment}
                          </Typography>
                        </Box>
                      </Box>
                      {review.id !== mockReviews[mockReviews.length - 1].id && (
                        <Divider className="mt-4" />
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* サイドバー */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box className="space-y-6">
            {/* 基本情報 */}
            <Card>
              <CardContent className="p-6">
                <Typography variant="h6" className="mb-4">
                  基本情報
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding className="mb-3">
                    <ListItemIcon className="min-w-0 mr-3">
                      <LocationOn className="text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" className="font-medium">
                          住所
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {spotData.address}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding className="mb-3">
                    <ListItemIcon className="min-w-0 mr-3">
                      <Phone className="text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" className="font-medium">
                          電話番号
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {spotData.phone}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding className="mb-3">
                    <ListItemIcon className="min-w-0 mr-3">
                      <AccessTime className="text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" className="font-medium">
                          営業時間
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {spotData.hours}
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemIcon className="min-w-0 mr-3">
                      <Share className="text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" className="font-medium">
                          ウェブサイト
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          className="text-primary-500 hover:underline cursor-pointer"
                          onClick={() =>
                            window.open(spotData.website, '_blank')
                          }
                        >
                          公式サイトを見る
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* アクション */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Favorite />}
                  color="secondary"
                  className="bg-accent-500 text-accent-foreground hover:bg-accent-600"
                >
                  いいねする
                </Button>
                <Button variant="outlined" fullWidth startIcon={<Share />}>
                  共有する
                </Button>
                <Button variant="outlined" fullWidth startIcon={<Star />}>
                  レビューを書く
                </Button>
              </CardContent>
            </Card>

            {/* 近くのスポット */}
            <Card>
              <CardContent className="p-6">
                <Typography variant="h6" className="mb-4">
                  近くのスポット
                </Typography>
                <Box className="space-y-3">
                  {mockSpotLocations.slice(1, 3).map((spot) => (
                    <Box
                      key={spot.id}
                      className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Card className="w-16 h-16 overflow-hidden flex-shrink-0">
                        <Image
                          src={spot.image || '/placeholder.svg'}
                          alt={spot.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </Card>
                      <Box className="flex-1">
                        <Typography variant="body2" className="font-medium">
                          {spot.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          徒歩8分
                        </Typography>
                        <Chip
                          label={spot.category}
                          size="small"
                          variant="outlined"
                          className="ml-2"
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
