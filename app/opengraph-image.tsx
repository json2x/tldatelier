import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Atelier — AI Domain Name Generator'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #5516be 0%, #7c3aed 100%)',
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 140,
              backgroundColor: 'white',
              borderRadius: '32px',
              marginBottom: 48,
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            }}
          >
            <span
              style={{
                color: '#5516be',
                fontSize: 90,
                fontWeight: 800,
                fontFamily: 'sans-serif',
                lineHeight: 1,
                marginTop: 8,
              }}
            >
              A
            </span>
          </div>

          <h1
            style={{
              color: 'white',
              fontSize: 96,
              fontWeight: 800,
              fontFamily: 'sans-serif',
              margin: 0,
              letterSpacing: '-0.03em',
            }}
          >
            Atelier
          </h1>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 48,
              fontWeight: 500,
              fontFamily: 'sans-serif',
              marginTop: 24,
              letterSpacing: '-0.01em',
            }}
          >
            AI Domain Name Generator
          </p>
        </div>
      </div>
    ),
    { ...size }
  )
}
