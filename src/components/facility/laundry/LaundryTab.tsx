import type { LaundryState } from '@/pages/facility/useLaundry'
import { AvailabilitySummary } from './AvailabilitySummary'
import { LaundryRegisterModal } from './LaundryRegisterModal'
import { MachineDetailModal } from './MachineDetailModal'
import { MachineGrid } from './MachineGrid'
import { MyMachineBanner } from './MyMachineBanner'

interface LaundryTabProps {
  laundry: LaundryState
}

export function LaundryTab({ laundry }: LaundryTabProps) {
  const {
    machines,
    myMachines,
    now,
    release,
    registerMachine,
    openRegister,
    closeRegister,
    register,
    detailMachine,
    openDetail,
    closeDetail,
  } = laundry

  return (
    <div className="space-y-4">
      <AvailabilitySummary machines={machines} />

      {myMachines.length > 0 && (
        <div className="space-y-2">
          {myMachines.map((machine) => (
            <MyMachineBanner
              key={machine.id}
              machine={machine}
              now={now}
              onRelease={release}
            />
          ))}
        </div>
      )}

      <MachineGrid
        machines={machines}
        now={now}
        onSelect={(m) =>
          m.status === 'available' ? openRegister(m.id) : openDetail(m.id)
        }
      />

      <LaundryRegisterModal
        machine={registerMachine}
        onClose={closeRegister}
        onSubmit={register}
      />
      <MachineDetailModal
        machine={detailMachine}
        now={now}
        onClose={closeDetail}
        onRelease={release}
      />
    </div>
  )
}
