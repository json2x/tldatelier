import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#5516be',
          borderRadius: '40px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 120,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            lineHeight: 1,
            marginTop: 12,
          }}
        >
          A
        </span>
      </div>
    ),
    { ...size }
  )
}
