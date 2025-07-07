// Google Maps API関連のユーティリティ関数

export interface MapLocation {
  lat: number
  lng: number
}

export interface SpotLocation extends MapLocation {
  id: number
  name: string
  category: string
  description: string
  rating: number
  image: string
}

// 鎌倉の中心座標
export const KAMAKURA_CENTER: MapLocation = {
  lat: 35.3192,
  lng: 139.5466,
}

// モックスポットデータ（実際の鎌倉の座標）
export const mockSpotLocations: SpotLocation[] = [
  {
    id: 1,
    name: '隠れ茶屋 竹の庵',
    category: 'グルメ',
    description: '竹林の奥にある秘密の茶屋',
    rating: 4.8,
    image: '/placeholder.svg?height=200&width=300',
    lat: 35.3367,
    lng: 139.5468, // 北鎌倉駅周辺
  },
  {
    id: 2,
    name: '夕日の展望台',
    category: '景観',
    description: '絶景の夕日スポット',
    rating: 4.9,
    image: '/placeholder.svg?height=200&width=300',
    lat: 35.3084,
    lng: 139.5364, // 稲村ヶ崎周辺
  },
  {
    id: 3,
    name: '古民家ギャラリー',
    category: '文化',
    description: '築100年の古民家アートギャラリー',
    rating: 4.6,
    image: '/placeholder.svg?height=200&width=300',
    lat: 35.3194,
    lng: 139.5503, // 鎌倉駅周辺
  },
  {
    id: 4,
    name: '秘密の竹林小径',
    category: '自然',
    description: '静寂な竹林の散歩道',
    rating: 4.7,
    image: '/placeholder.svg?height=200&width=300',
    lat: 35.3373,
    lng: 139.5445, // 報国寺周辺
  },
  {
    id: 5,
    name: '地元民の愛する蕎麦屋',
    category: 'グルメ',
    description: '創業50年の手打ち蕎麦',
    rating: 4.8,
    image: '/placeholder.svg?height=200&width=300',
    lat: 35.3156,
    lng: 139.5389, // 長谷駅周辺
  },
  {
    id: 6,
    name: '隠れ神社の桜',
    category: '歴史',
    description: '春限定の美しい桜スポット',
    rating: 4.5,
    image: '/placeholder.svg?height=200&width=300',
    lat: 35.3267,
    lng: 139.5553, // 建長寺周辺
  },
]

// Google Maps埋め込みURL生成
export const generateGoogleMapsEmbedUrl = (
  location: MapLocation,
  zoom = 15,
): string => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${location.lat},${location.lng}&zoom=${zoom}&maptype=roadmap`
}

// Google Maps検索URL生成（スポット名での検索）
export const generateGoogleMapsSearchUrl = (
  spotName: string,
  location: MapLocation,
): string => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  const query = encodeURIComponent(spotName)
  return `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${query}&center=${location.lat},${location.lng}&zoom=16`
}

// 距離計算（ハーバーサイン公式）
export const calculateDistance = (
  pos1: MapLocation,
  pos2: MapLocation,
): number => {
  const R = 6371 // 地球の半径（km）
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180
  const dLng = ((pos2.lng - pos1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 現在地からの距離を文字列で返す
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}
