import { CalendarDays, WashingMachine } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Reservation } from '@/lib/timeSlots'
import { MachineAvailabilityTile } from './MachineAvailabilityTile'
import { MeetingRoomTimeline } from './MeetingRoomTimeline'

export interface MachineStatus {
  available: number
  total: number
}

interface FacilitySectionProps {
  icon: ReactNode
  title: string
  actionLabel: string
  onAction?: () => void
  children: ReactNode
}

function FacilitySection({
  icon,
  title,
  actionLabel,
  onAction,
  children,
}: FacilitySectionProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary [&>svg]:size-4">
            {icon}
          </span>
          {title}
        </h3>
        <button
          type="button"
          onClick={onAction}
          className="h-7 rounded-xl bg-primary-soft px-3 text-primary"
        >
          <span className="block text-[13px] leading-none font-medium">
            {actionLabel}
          </span>
        </button>
      </div>
      {children}
    </section>
  )
}

interface FacilityStatusCardProps {
  washers: MachineStatus
  dryers: MachineStatus
  reservations: Reservation[]
  onRegisterLaundry?: () => void
  onReserveMeetingRoom?: () => void
}

export function FacilityStatusCard({
  washers,
  dryers,
  reservations,
  onRegisterLaundry,
  onReserveMeetingRoom,
}: FacilityStatusCardProps) {
  return (
    <Card>
      <SectionHeader
        title="시설 이용 현황"
      />

      <div className="mt-5 space-y-4">
        <FacilitySection
          icon={<WashingMachine />}
          title="세탁 / 건조"
          actionLabel="이용 등록"
          onAction={onRegisterLaundry}
        >
          <div className="grid grid-cols-2 gap-3">
            <MachineAvailabilityTile label="세탁기" tone="blue" {...washers} />
            <MachineAvailabilityTile label="건조기" tone="green" {...dryers} />
          </div>
        </FacilitySection>

        <hr className="border-line" />

        <FacilitySection
          icon={<CalendarDays />}
          title="회의실"
          actionLabel="예약하기"
          onAction={onReserveMeetingRoom}
        >
          <MeetingRoomTimeline reservations={reservations} />
        </FacilitySection>
      </div>
    </Card>
  )
}
