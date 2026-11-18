import * as THREE from 'three'

/**
 * Every texture the journey uses is drawn here on a canvas at runtime, so the
 * scene ships no image files beyond the land mask. Flags are simplified for a
 * ~6-unit cloth seen from a distance, not reproductions at print fidelity.
 */

function canvas(width: number, height: number) {
  const element = document.createElement('canvas')
  element.width = width
  element.height = height
  const context = element.getContext('2d')
  if (!context) throw new Error('2D canvas unavailable')
  return { element, context }
}

function toTexture(element: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(element)
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/** The pale ground grid the cities sit on. One tile covers 32 world units. */
export function gridTexture(): THREE.CanvasTexture {
  const { element, context } = canvas(256, 256)
  context.fillStyle = '#f6f7fa'
  context.fillRect(0, 0, 256, 256)
  context.strokeStyle = '#e2e5ec'
  context.lineWidth = 2
  for (let i = 0; i <= 256; i += 64) {
    context.beginPath()
    context.moveTo(i, 0)
    context.lineTo(i, 256)
    context.moveTo(0, i)
    context.lineTo(256, i)
    context.stroke()
  }
  const texture = toTexture(element)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

/** Soft round dot, used for the globe's points and the stars. */
export function dotTexture(): THREE.CanvasTexture {
  const { element, context } = canvas(64, 64)
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)
  return toTexture(element)
}

/** The blurred disc under the plane, standing in for a cast shadow. */
export function blobTexture(): THREE.CanvasTexture {
  const { element, context } = canvas(128, 128)
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(20,24,40,0.55)')
  gradient.addColorStop(1, 'rgba(20,24,40,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  return toTexture(element)
}

export type FlagKind = 'india' | 'usa' | 'qatar' | 'saudi'

export function flagTexture(kind: FlagKind): THREE.CanvasTexture {
  const W = 300
  const H = 200
  const { element, context: c } = canvas(W, H)

  switch (kind) {
    case 'india': {
      const band = H / 3
      c.fillStyle = '#ff9933'
      c.fillRect(0, 0, W, band)
      c.fillStyle = '#ffffff'
      c.fillRect(0, band, W, band)
      c.fillStyle = '#138808'
      c.fillRect(0, band * 2, W, band)
      // Ashoka Chakra: a navy wheel of 24 spokes.
      c.strokeStyle = '#000080'
      c.lineWidth = 3
      c.beginPath()
      c.arc(W / 2, H / 2, band * 0.42, 0, Math.PI * 2)
      c.stroke()
      c.lineWidth = 1.4
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2
        c.beginPath()
        c.moveTo(W / 2, H / 2)
        c.lineTo(W / 2 + Math.cos(a) * band * 0.42, H / 2 + Math.sin(a) * band * 0.42)
        c.stroke()
      }
      break
    }
    case 'usa': {
      const stripe = H / 13
      for (let i = 0; i < 13; i++) {
        c.fillStyle = i % 2 === 0 ? '#b22234' : '#ffffff'
        c.fillRect(0, i * stripe, W, stripe)
      }
      c.fillStyle = '#3c3b6e'
      c.fillRect(0, 0, W * 0.4, stripe * 7)
      c.fillStyle = '#ffffff'
      for (let row = 0; row < 9; row++) {
        const count = row % 2 === 0 ? 6 : 5
        for (let col = 0; col < count; col++) {
          const x = ((col + (row % 2 === 0 ? 0.5 : 1)) / 6) * W * 0.4
          const y = ((row + 0.6) / 9.4) * stripe * 7
          c.beginPath()
          c.arc(x, y, 2.6, 0, Math.PI * 2)
          c.fill()
        }
      }
      break
    }
    case 'qatar': {
      c.fillStyle = '#8a1538'
      c.fillRect(0, 0, W, H)
      // White hoist band with nine serrations.
      const band = W * 0.24
      const depth = W * 0.08
      const step = H / 9
      c.fillStyle = '#ffffff'
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(band, 0)
      for (let i = 0; i < 9; i++) {
        c.lineTo(band + depth, i * step + step / 2)
        c.lineTo(band, (i + 1) * step)
      }
      c.lineTo(0, H)
      c.closePath()
      c.fill()
      break
    }
    case 'saudi': {
      c.fillStyle = '#006c35'
      c.fillRect(0, 0, W, H)
      c.fillStyle = '#ffffff'
      // The Shahada, set as real text so it is the inscription rather than
      // an imitation of one.
      c.direction = 'rtl'
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.font =
        '600 30px "IBM Plex Sans Arabic", "Noto Naskh Arabic", "Geeza Pro", serif'
      c.fillText('لا إله إلا الله محمد رسول الله', W / 2, H * 0.4)
      // Sword beneath, hilt toward the fly.
      c.fillRect(W * 0.2, H * 0.68, W * 0.56, 5)
      c.fillRect(W * 0.72, H * 0.63, 5, 16)
      c.fillRect(W * 0.74, H * 0.665, W * 0.07, 7)
      break
    }
  }

  return toTexture(element)
}
