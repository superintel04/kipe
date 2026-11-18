/**
 * The journey page's one clock. Scroll position through the flight section is
 * a single number `p` in 0–1; this file turns it into which beat of the story
 * is playing and how far through it we are. The 3D scene and the DOM overlays
 * both read from here, so the camera, the cards and the route rail can never
 * disagree about where the visitor is.
 *
 * Weights are relative lengths of scroll. A hold is where a city's card is up,
 * so it gets a little more room than a flight.
 */

export type Segment =
  | { kind: 'globe' }
  | { kind: 'dive' }
  | { kind: 'reveal' }
  | { kind: 'hold'; stop: number }
  | { kind: 'fly'; from: number }
  | { kind: 'outro' }

/** Number of cities on the route. The content bundle supplies one stop each. */
export const STOP_COUNT = 4

const HOLD = 1.25
const FLY = 1.4

function buildSegments(): { segment: Segment; weight: number }[] {
  const list: { segment: Segment; weight: number }[] = [
    { segment: { kind: 'globe' }, weight: 1 },
    { segment: { kind: 'dive' }, weight: 0.8 },
    { segment: { kind: 'reveal' }, weight: 0.45 },
  ]
  for (let stop = 0; stop < STOP_COUNT; stop++) {
    list.push({ segment: { kind: 'hold', stop }, weight: HOLD })
    if (stop < STOP_COUNT - 1) {
      list.push({ segment: { kind: 'fly', from: stop }, weight: FLY })
    }
  }
  list.push({ segment: { kind: 'outro' }, weight: 0.7 })
  return list
}

export const SEGMENTS = buildSegments()

/** Total scroll length in units; the page multiplies it by a viewport fraction. */
export const TOTAL_UNITS = SEGMENTS.reduce((sum, item) => sum + item.weight, 0)

export type Located = { index: number; segment: Segment; t: number }

export function locate(p: number): Located {
  let units = clamp01(p) * TOTAL_UNITS
  for (let index = 0; index < SEGMENTS.length; index++) {
    const { segment, weight } = SEGMENTS[index]
    if (units <= weight || index === SEGMENTS.length - 1) {
      return { index, segment, t: clamp01(units / weight) }
    }
    units -= weight
  }
  // Unreachable — the loop always returns on its last iteration.
  return { index: 0, segment: SEGMENTS[0].segment, t: 0 }
}

/** Where in `p` a given segment starts — used to jump to a stop from the rail. */
export function segmentStart(match: (segment: Segment) => boolean): number {
  let units = 0
  for (const { segment, weight } of SEGMENTS) {
    if (match(segment)) return units / TOTAL_UNITS
    units += weight
  }
  return 0
}

export type Overlays = {
  /** Opacity of the hero copy over the globe. */
  hero: number
  /** White flash that hides the cut from the globe to the cities. */
  flash: number
  /** Black that the last city fades into, matching the section after it. */
  dark: number
  /** Index of the stop whose card is up, or -1 between cities. */
  activeStop: number
  /** 0…STOP_COUNT-1 along the route, fractional while flying. */
  route: number
  /** Whether the route rail should show at all. */
  showRoute: boolean
}

export function overlays(p: number): Overlays {
  const { segment, t } = locate(p)
  const result: Overlays = {
    hero: 0,
    flash: 0,
    dark: 0,
    activeStop: -1,
    route: 0,
    showRoute: false,
  }

  switch (segment.kind) {
    case 'globe':
      result.hero = 1 - smoothstep(0.45, 1, t)
      break
    case 'dive':
      result.flash = smoothstep(0.55, 1, t)
      break
    case 'reveal':
      result.flash = 1 - smoothstep(0, 0.75, t)
      result.showRoute = t > 0.4
      break
    case 'hold':
      result.route = segment.stop
      result.showRoute = true
      if (t > 0.06 && t < 0.94) result.activeStop = segment.stop
      break
    case 'fly':
      result.route = segment.from + easeInOut(t)
      result.showRoute = true
      break
    case 'outro':
      result.route = STOP_COUNT - 1
      result.showRoute = t < 0.4
      result.dark = smoothstep(0.35, 1, t)
      break
  }

  return result
}

// ---- Small maths shared by the scene ---------------------------------------

export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const x = clamp01((value - edge0) / (edge1 - edge0))
  return x * x * (3 - 2 * x)
}

export function easeInOut(value: number): number {
  const x = clamp01(value)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
