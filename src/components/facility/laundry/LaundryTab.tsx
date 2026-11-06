import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { machineTitle } from '@/lib/laundry'
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
    releaseMachine,
    requestRelease,
    cancelRelease,
    registerMachine,
    openRegister,
    closeRegister,
    register,
    detailMachine,
    openDetail,
    closeDetail,
  } = laundry

  const isDone = releaseMachine?.status === 'done'

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
              onRelease={requestRelease}
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
        onRelease={requestRelease}
      />
      <ConfirmModal
        open={releaseMachine !== null}
        tone="primary"
        title={isDone ? '수거를 완료할까요?' : '이용을 끝낼까요?'}
        description={
          releaseMachine &&
          (isDone
            ? `${machineTitle(releaseMachine)}이 사용 가능 상태로 바뀌어요.`
            : `${machineTitle(releaseMachine)} 이용이 종료되고 사용 가능 상태로 바뀌어요.`)
        }
        cancelLabel="닫기"
        confirmLabel={isDone ? '수거 완료' : '이용 끝내기'}
        onCancel={cancelRelease}
        onConfirm={() => releaseMachine && release(releaseMachine.id)}
      />
    </div>
  )
}
