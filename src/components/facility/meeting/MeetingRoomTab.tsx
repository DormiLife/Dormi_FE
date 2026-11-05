import { DatePickerField } from '@/components/ui/DatePickerField'
import type { MeetingBooking } from '@/pages/facility/useMeetingBooking'
import { DayReservationList } from './DayReservationList'
import { MeetingBookingModal } from './MeetingBookingModal'
import { ReservationDetailModal } from './ReservationDetailModal'
import { SlotTimeline } from './SlotTimeline'

interface MeetingRoomTabProps {
  booking: MeetingBooking
}

export function MeetingRoomTab({ booking }: MeetingRoomTabProps) {
  const {
    today,
    selectedDate,
    dateKey,
    isToday,
    slotStates,
    selection,
    initialSlot,
    dayItems,
    bookingFormOpen,
    detail,
    changeDate,
    selectSlot,
    openBookingForm,
    closeBookingForm,
    book,
    openDetail,
    openReservationDetail,
    closeDetail,
    cancelReservation,
  } = booking

  return (
    <div className="space-y-3">
      <DatePickerField value={selectedDate} min={today} onChange={changeDate} />

      <SlotTimeline
        slots={slotStates}
        selection={selection}
        initialSlot={initialSlot}
        resetKey={dateKey}
        onSlotClick={selectSlot}
        onReservationClick={openDetail}
        date={selectedDate}
        onBook={openBookingForm}
      />

      <DayReservationList
        date={selectedDate}
        isToday={isToday}
        items={dayItems}
        onItemClick={openReservationDetail}
      />

      <MeetingBookingModal
        open={bookingFormOpen}
        date={selectedDate}
        selection={selection}
        onClose={closeBookingForm}
        onSubmit={book}
      />

      <ReservationDetailModal
        detail={detail}
        onClose={closeDetail}
        onCancel={cancelReservation}
      />
    </div>
  )
}
