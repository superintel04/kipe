import Logo from '@/components/Logo'
import Reveal from '@/components/Reveal'
import Section from '@/components/Section'
import { useContent } from '@/content'
import {
  BrandingButton,
  DeliverableTag,
} from '@/components/branding/BrandingPrimitives'
import qrCode from '@/assets/branding/qr-kipe.svg'
import mug from '@/assets/branding/mug.svg'
import letterhead from '@/assets/branding/letterhead.svg'
import keychainRing from '@/assets/branding/keychain-ring.svg'

/** The brand blue the mockups are drawn in (Figma 23:1257). */
const MOCK_BLUE = '#2a65fe'

/**
 * The LinkedIn-style profile card the hero is built around (Figma 23:1256):
 * a designed banner, an avatar straddling its lower edge, then the pitch.
 *
 * It is a mockup of a deliverable, not a real profile, so the banner's name
 * and tagline are sample content and the avatar shows initials rather than a
 * photograph. The whole card carries one `alt` through its banner image role
 * rather than exposing every sample string to a screen reader twice.
 */
function ProfileCard() {
  const { branding } = useContent()
  const { card } = branding.hero

  return (
    <div className="relative overflow-hidden rounded-[12px] border border-border bg-bg">
      {/* Banner. The mark and the sample domain are decorative within the
          mockup; the tagline is set as real text so it stays crisp. */}
      <div
        className="relative h-[140px] overflow-hidden md:h-[192px]"
        style={{ backgroundColor: MOCK_BLUE }}
        role="img"
        aria-label={card.bannerAlt}
      >
        <Logo className="absolute start-7 top-6 size-10 text-white md:size-12" />
        <span className="absolute end-7 top-6 text-[18px] font-extrabold tracking-[-0.03em] text-white md:text-[24px]">
          {card.bannerName}
        </span>
        <span className="absolute end-7 bottom-7 hidden text-[17px] font-bold tracking-[-0.02em] whitespace-pre text-white lg:block">
          {card.bannerTagline}
        </span>
      </div>

      {/* Avatar, overlapping the banner's lower edge as in the design. */}
      <div
        aria-hidden="true"
        className="absolute start-7 top-[96px] flex size-[88px] items-center justify-center rounded-full border-[5px] border-white bg-bg-muted text-h3 font-bold text-fg-subtle md:top-[125px] md:size-[132px]"
      >
        {card.initials}
      </div>

      <div className="flex flex-col gap-3 px-6 pt-[56px] pb-6 md:pt-[76px]">
        <h1 className="max-w-[640px] text-h3 leading-[1.14] font-bold tracking-[-0.025em]">
          {card.headline}
        </h1>
        <p className="max-w-[600px] text-body leading-[1.6] text-fg-muted">
          {card.body}
        </p>

        <ul className="flex flex-wrap items-center gap-2 text-body-sm leading-[1.6]">
          {card.meta.map((item, index) => (
            <li
              key={item}
              className={
                // The last entry is availability, not description, so it
                // takes the accent — the one accented run in this block.
                index === card.meta.length - 1
                  ? 'text-accent-fg'
                  : 'text-fg-subtle'
              }
            >
              {index > 0 && (
                <span aria-hidden="true" className="me-2 text-fg-subtle">
                  ·
                </span>
              )}
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3 pt-2">
          <BrandingButton href={branding.bookingUrl}>
            {card.primaryCta}
          </BrandingButton>
          <BrandingButton href={branding.packagesAnchor} variant="outline">
            {card.secondaryCta}
          </BrandingButton>
        </div>
      </div>
    </div>
  )
}

/** The logo lockup and sample visiting card (Figma 23:1279). */
function LogoAndCard() {
  const { branding } = useContent()
  const { lockup, visitingCard } = branding.hero

  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-border bg-bg p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-[60px] shrink-0 items-center justify-center rounded-[8px]"
          style={{ backgroundColor: MOCK_BLUE }}
        >
          <Logo className="size-8 text-white" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-[20px] font-extrabold tracking-[-0.02em]">
            {lockup.name}
          </span>
          <span className="text-caption leading-[1.35] text-fg-subtle">
            {lockup.caption}
          </span>
        </span>
      </div>

      <div aria-hidden="true" className="h-px w-full bg-border-subtle" />

      {/* The visiting card. Set at the design's true scale — 8–13px type on a
          149px card — because it is a picture of a card, not type to read. */}
      <div className="flex gap-3 rounded-[8px] border border-border bg-bg p-[14px]">
        <div className="flex min-w-px flex-1 flex-col gap-[5px]">
          <span
            aria-hidden="true"
            className="flex size-[42px] items-center justify-center rounded-[5px] bg-bg-muted text-[12px] font-bold tracking-[-0.02em] text-fg-subtle"
          >
            {visitingCard.initials}
          </span>
          <span className="text-[13px] font-bold tracking-[-0.02em]">
            {visitingCard.name}
          </span>
          <span className="flex flex-col gap-px text-[8px] tracking-[-0.02em] text-fg-muted">
            {visitingCard.roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </span>
          <span
            dir="ltr"
            className="flex flex-col gap-px pt-1 text-[8px] tracking-[-0.02em] text-fg-subtle rtl:text-right"
          >
            <span>{visitingCard.phone}</span>
            <span>{visitingCard.email}</span>
          </span>
        </div>

        <div className="flex w-[96px] shrink-0 flex-col items-center gap-[5px]">
          <span className="text-[7px] tracking-[-0.02em] text-fg-subtle">
            {visitingCard.scanLabel}
          </span>
          {/* A real code, generated for kipe.ai at the design's own 25-module
              grid — the Figma layer is a non-scannable placeholder. */}
          <img
            src={qrCode}
            alt={visitingCard.qrAlt}
            width={84}
            height={84}
            className="size-[84px]"
          />
          <span className="text-[12px] font-extrabold tracking-[-0.02em]">
            {visitingCard.site}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * One stationery tile: the object on a tinted stage, with its name beneath.
 * The mug and letterhead are single exported vectors; the keychain and
 * notebook are composed from primitives, exactly as the design draws them.
 */
function StationeryTile({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-px flex-1 flex-col items-center gap-2">
      <div className="relative h-[128px] w-full overflow-hidden rounded-[8px] bg-bg-subtle">
        {children}
      </div>
      <p className="text-[10px] font-semibold tracking-[-0.02em] text-fg-muted">
        {label}
      </p>
    </div>
  )
}

/** Stationery and merchandise (Figma 23:1306). */
function Stationery() {
  const { branding } = useContent()
  const [mugLabel, keychainLabel, letterheadLabel, notebookLabel] =
    branding.hero.stationery

  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-border bg-bg p-5">
      <div className="flex gap-3">
        <StationeryTile label={mugLabel}>
          <img
            src={mug}
            alt=""
            aria-hidden="true"
            width={117}
            height={94}
            className="absolute start-[29px] top-[17px] h-[94px] w-[117px] max-w-none"
          />
        </StationeryTile>

        <StationeryTile label={keychainLabel}>
          <span
            aria-hidden="true"
            className="absolute start-[18px] top-[42px] block h-[44px] w-[134px]"
          >
            <span className="absolute start-0 top-[2px] h-[14px] w-[6px] rounded-[3px] bg-neutral-400" />
            <span className="absolute start-[3px] top-0 h-[40px] w-[96px] rounded-[5px] bg-neutral-300" />
            <span
              className="absolute start-[8px] top-[5px] h-[30px] w-[86px] rounded-[3px]"
              style={{ backgroundColor: MOCK_BLUE }}
            />
            <Logo className="absolute start-[14px] top-[11px] size-[18px] text-white" />
            <span className="absolute start-[38px] top-[15px] text-[10px] font-bold tracking-[-0.02em] text-white">
              kipe.ai
            </span>
            <span className="absolute start-[96px] top-[15px] h-[10px] w-[12px] rounded-[3px] bg-neutral-400" />
            <img
              src={keychainRing}
              alt=""
              width={36}
              height={36}
              className="absolute start-[100px] top-[2px] size-9 max-w-none"
            />
          </span>
        </StationeryTile>
      </div>

      <div className="flex gap-3">
        <StationeryTile label={letterheadLabel}>
          <img
            src={letterhead}
            alt=""
            aria-hidden="true"
            width={86}
            height={112}
            className="absolute start-[42px] top-[8px] h-[112px] w-[86px] max-w-none"
          />
        </StationeryTile>

        <StationeryTile label={notebookLabel}>
          <span
            aria-hidden="true"
            className="absolute start-[44px] top-[7px] block h-[114px] w-[82px]"
          >
            <span className="absolute start-[26px] top-[102px] h-[12px] w-[5px] bg-neutral-950" />
            <span className="absolute start-0 top-0 h-[112px] w-[74px] rounded-[5px] bg-[#3d3d3d]" />
            <span className="absolute start-0 top-0 h-[112px] w-[5px] bg-neutral-800" />
            <span className="absolute start-[59px] top-0 h-[112px] w-[5px] bg-neutral-950" />
            <span className="absolute start-[70px] top-[40px] h-[26px] w-[9px] rounded-[3px] bg-neutral-800" />
            <Logo className="absolute start-[24px] top-[43px] size-[26px] text-white" />
          </span>
        </StationeryTile>
      </div>
    </div>
  )
}

/**
 * The device showcase (Figma 23:1363). The chrome is drawn rather than
 * exported so the bezels stay crisp at any zoom and the screens can hold a
 * real image; only the screen art is a raster.
 */
function Devices() {
  const { branding } = useContent()
  const { devices } = branding.hero

  return (
    <div className="relative mx-auto hidden h-[450px] w-[1184px] origin-top lg:block">
      {/* Monitor */}
      <div className="device-bezel absolute start-[280px] top-0 h-[370px] w-[580px] rounded-[10px] p-[10px]">
        <div className="h-full w-full overflow-hidden rounded-[2px] bg-bg">
          <img
            src="/branding/showcase-desktop.png"
            alt={devices.desktopAlt}
            width={560}
            height={350}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-top"
          />
        </div>
      </div>
      <div className="absolute start-[547px] top-[370px] h-[32px] w-[46px] rounded-b-[4px] bg-neutral-300" />
      <div className="absolute start-[486px] top-[402px] h-[10px] w-[168px] rounded-[5px] bg-neutral-400" />

      {/* Laptop */}
      <div className="device-bezel absolute start-[702px] top-[150px] h-[282px] w-[440px] rounded-[8px] p-[7px]">
        <div className="h-full w-full overflow-hidden rounded-[2px] bg-bg">
          <img
            src="/branding/showcase-desktop.png"
            alt=""
            aria-hidden="true"
            width={426}
            height={266}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-top"
          />
        </div>
      </div>
      <div className="absolute start-[685px] top-[432px] h-[11px] w-[474px] rounded-[6px] bg-neutral-400" />

      {/* Tablet */}
      <div className="device-bezel absolute start-[120px] top-[120px] h-[282px] w-[216px] rounded-[12px] p-[8px]">
        <div className="h-full w-full overflow-hidden rounded-[4px] bg-bg">
          <img
            src="/branding/showcase-tablet.png"
            alt={devices.tabletAlt}
            width={200}
            height={266}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * The hero (Figma 23:1248). Two columns above `lg` — the profile card beside
 * the deliverables — then the device showcase beneath. Below `lg` everything
 * stacks and the devices drop out: three mockup screens at phone width read
 * as clutter rather than as proof.
 */
export default function BrandingHero() {
  const { branding } = useContent()
  const { hero } = branding

  return (
    <Section id="work" innerClassName="pt-12 pb-16 md:pt-24 md:pb-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
        <div className="flex flex-col gap-6 lg:w-[65%]">
          <Reveal>
            <DeliverableTag {...hero.profileTag} />
          </Reveal>
          <Reveal delay={60}>
            <ProfileCard />
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 lg:w-[35%]">
          <Reveal delay={120}>
            <DeliverableTag {...hero.deliverablesTag} />
          </Reveal>
          <Reveal delay={150}>
            <LogoAndCard />
          </Reveal>
          <Reveal delay={180}>
            <DeliverableTag {...hero.stationeryTag} />
          </Reveal>
          <Reveal delay={210}>
            <Stationery />
          </Reveal>
        </div>
      </div>

      <div className="mt-16 hidden flex-col gap-6 lg:flex">
        <Reveal>
          <DeliverableTag {...hero.devicesTag} />
        </Reveal>
        <Reveal delay={80}>
          <Devices />
        </Reveal>
      </div>
    </Section>
  )
}
