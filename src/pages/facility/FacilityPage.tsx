import { useNavigate, useSearch } from '@tanstack/react-router'
import { LaundryTab } from '@/components/facility/laundry/LaundryTab'
import { MeetingRoomTab } from '@/components/facility/meeting/MeetingRoomTab'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { DEFAULT_FACILITY_TAB, type FacilityTab } from '@/lib/facility'
import { useLaundry } from './useLaundry'
import { useMeetingBooking } from './useMeetingBooking'

export function FacilityPage() {
  const { tab = DEFAULT_FACILITY_TAB } = useSearch({ from: '/facility' })
  const navigate = useNavigate()

  // 탭을 오가도 선택하던 상태가 유지되도록 상태는 페이지에서 가진다.
  const laundry = useLaundry()
  const booking = useMeetingBooking()

  const changeTab = (next: FacilityTab) =>
    navigate({ to: '/facility', search: { tab: next }, replace: true })

  return (
    <PageLayout
      header={<PageHeader title="시설" centered />}
      bottomNav={<BottomNav active="facility" />}
      className="space-y-3"
    >
      <SegmentedControl
        variant="track"
        value={tab}
        onChange={changeTab}
        options={[
          { value: 'laundry', label: '세탁 · 건조' },
          { value: 'meeting', label: '회의실' },
        ]}
      />

      {tab === 'laundry' ? (
        <LaundryTab laundry={laundry} />
      ) : (
        <MeetingRoomTab booking={booking} />
      )}
    </PageLayout>
  )
}
