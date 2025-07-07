'use client'

import { LocationOn, MyLocation, Layers } from '@mui/icons-material'
import { Box, Card, Typography, Chip, Fab } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import {
  mockSpotLocations,
  KAMAKURA_CENTER,
  type SpotLocation,
  type MapLocation,
} from '@/lib/google-maps'

interface InteractiveMapProps {
  selectedSpot?: SpotLocation | null
  onSpotSelect?: (spot: SpotLocation) => void
  height?: string
  showControls?: boolean
}

declare global {
  interface Window {
    google: any
    initMap?: () => void
  }
}

export default function InteractiveMap({
  selectedSpot,
  onSpotSelect,
  height = '400px',
  showControls = true,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [, setUserLocation] = useState<MapLocation | null>(null)
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap')
  const [isLoading, setIsLoading] = useState(true)

  // Google Maps APIの初期化
  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: KAMAKURA_CENTER,
        zoom: 13,
        mapTypeId: mapType,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      setMap(mapInstance)
      setIsLoading(false)

      // マーカーを追加
      const newMarkers = mockSpotLocations.map((spot) => {
        const marker = new window.google.maps.Marker({
          position: { lat: spot.lat, lng: spot.lng },
          map: mapInstance,
          title: spot.name,
          icon: {
            url: getCategoryIcon(spot.category),
            scaledSize: new window.google.maps.Size(40, 40),
          },
        })

        // 情報ウィンドウ
        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(spot),
        })

        marker.addListener('click', () => {
          // 他の情報ウィンドウを閉じる
          markers.forEach((m) => m.infoWindow?.close())
          infoWindow.open(mapInstance, marker)
          onSpotSelect?.(spot)
        })

        return { marker, infoWindow, spot }
      })

      setMarkers(newMarkers)
    }

    // Google Maps APIが読み込まれているかチェック
    if (window.google && window.google.maps) {
      initializeMap()
    } else {
      // Google Maps APIを動的に読み込み
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true

      window.initMap = initializeMap
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
        delete window.initMap
      }
    }
  }, [mapType, onSpotSelect])

  // 選択されたスポットにフォーカス
  useEffect(() => {
    if (map && selectedSpot) {
      map.setCenter({ lat: selectedSpot.lat, lng: selectedSpot.lng })
      map.setZoom(16)

      // 対応するマーカーの情報ウィンドウを開く
      const targetMarker = markers.find((m) => m.spot.id === selectedSpot.id)
      if (targetMarker) {
        markers.forEach((m) => m.infoWindow?.close())
        targetMarker.infoWindow.open(map, targetMarker.marker)
      }
    }
  }, [selectedSpot, map, markers])

  // 現在地を取得
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)

          if (map) {
            map.setCenter(location)
            map.setZoom(15)

            // 現在地マーカーを追加
            new window.google.maps.Marker({
              position: location,
              map: map,
              title: '現在地',
              icon: {
                url:
                  'data:image/svg+xml;charset=UTF-8,' +
                  encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#ffffff" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
              },
            })
          }
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
        },
      )
    }
  }

  // カテゴリー別アイコンを取得
  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      グルメ: '#FF6B6B',
      景観: '#4ECDC4',
      文化: '#45B7D1',
      歴史: '#96CEB4',
      自然: '#FFEAA7',
    }

    const color = iconMap[category] || '#DDA0DD'
    return (
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${color}" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="20" cy="20" r="8" fill="#ffffff"/>
        </svg>
      `)
    )
  }

  // 情報ウィンドウのコンテンツを作成
  const createInfoWindowContent = (spot: SpotLocation): string => {
    return `
      <div style="padding: 8px; max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${spot.name}</h3>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${spot.category}</p>
        <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.4;">${spot.description}</p>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="color: #FFD700;">★</span>
          <span style="font-size: 14px; font-weight: bold;">${spot.rating}</span>
        </div>
      </div>
    `
  }

  return (
    <Card className="relative overflow-hidden">
      <Box
        ref={mapRef}
        sx={{
          height: height,
          width: '100%',
          position: 'relative',
        }}
      />

      {/* ローディング表示 */}
      {isLoading && (
        <Box
          className="absolute inset-0 flex items-center justify-center bg-secondary-50"
          sx={{ zIndex: 1 }}
        >
          <Box className="text-center">
            <LocationOn className="text-6xl text-primary-500 mb-2" />
            <Typography variant="h6">地図を読み込み中...</Typography>
          </Box>
        </Box>
      )}

      {/* コントロールボタン */}
      {showControls && !isLoading && (
        <>
          {/* 現在地ボタン */}
          <Fab
            size="small"
            className="absolute top-4 right-4 bg-white hover:bg-gray-50 shadow-md"
            onClick={getCurrentLocation}
            sx={{ zIndex: 2 }}
          >
            <MyLocation className="text-primary-500" />
          </Fab>

          {/* 地図タイプ切り替えボタン */}
          <Fab
            size="small"
            className="absolute top-16 right-4 bg-white hover:bg-gray-50 shadow-md"
            onClick={() =>
              setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')
            }
            sx={{ zIndex: 2 }}
          >
            <Layers className="text-primary-500" />
          </Fab>

          {/* 凡例 */}
          <Card className="absolute bottom-4 left-4 p-2" sx={{ zIndex: 2 }}>
            <Typography variant="caption" className="font-semibold mb-2 block">
              カテゴリー
            </Typography>
            <Box className="flex flex-wrap gap-1">
              {['グルメ', '景観', '文化', '歴史', '自然'].map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Card>
        </>
      )}
    </Card>
  )
}
