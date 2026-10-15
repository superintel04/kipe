import {
  iconDga,
  iconDocument,
  iconMoney,
  iconMonitor,
  iconPhone,
} from '@/content/assets'
import type { ProjectMetric, ProjectMetricIcon } from '@/content'

/**
 * Marks a metric can carry in place of a figure, at the dimensions they were
 * exported at (Figma 869:4068). `devices` is the overlapping phone-and-monitor
 * pair, so it is composed rather than looked up.
 */
const METRIC_ICON: Record<
  Exclude<ProjectMetricIcon, 'devices'>,
  { src: string; width: number; height: number }
> = {
  document: { src: iconDocument, width: 29, height: 29 },
  money: { src: iconMoney, width: 36, height: 36 },
  dga: { src: iconDga, width: 22, height: 32 },
}

function MetricMark({ icon }: { icon: ProjectMetricIcon }) {
  if (icon === 'devices') {
    return (
      <span aria-hidden="true" className="flex h-10 items-center -space-x-1.5">
        <img src={iconPhone} alt="" width={27} height={27} />
        <img src={iconMonitor} alt="" width={27} height={27} />
      </span>
    )
  }

  const mark = METRIC_ICON[icon]
  return (
    <span aria-hidden="true" className="flex h-10 items-center">
      <img src={mark.src} alt="" width={mark.width} height={mark.height} />
    </span>
  )
}

/**
 * One outcome: a figure and a caption, or a mark and a caption. The caption
 * carries the meaning either way, which is why the marks are decorative.
 */
function Metric({ metric }: { metric: ProjectMetric }) {
  return (
    <div className="flex flex-col gap-2">
      {metric.value ? (
        <p className="flex h-10 items-center text-h4 leading-[1.14] font-bold tracking-[-0.312px]">
          {metric.value}
        </p>
      ) : (
        metric.icon && <MetricMark icon={metric.icon} />
      )}
      <p className="text-body leading-[1.6] tracking-[-0.192px]">
        {metric.label}
      </p>
    </div>
  )
}

/**
 * The outcome grid. Shared by the home page's project cards and the brief on
 * each case study page, so a project's figures are written once and read the
 * same way in both places.
 */
export default function ProjectMetrics({
  metrics,
  className = '',
}: {
  metrics: ProjectMetric[]
  className?: string
}) {
  return (
    <div className={`grid grid-cols-2 gap-8 sm:grid-cols-3 ${className}`}>
      {metrics.map((metric) => (
        <Metric key={metric.label} metric={metric} />
      ))}
    </div>
  )
}
