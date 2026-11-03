import { CalendarDays, Bell, WashingMachine } from 'lucide-react'
import { useState } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconBox } from '@/components/ui/IconBox'
import { InfoBox } from '@/components/ui/InfoBox'
import { ListRow } from '@/components/ui/ListRow'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Tabs } from '@/components/ui/Tabs'
import { TextArea } from '@/components/ui/TextArea'
import { TextField } from '@/components/ui/TextField'

// 공용 컴포넌트 확인용 임시 화면. 실제 페이지가 생기면 삭제한다.
export function ComponentPreview() {
  const [tab, setTab] = useState('all')
  const [board, setBoard] = useState('all')
  const [gender, setGender] = useState('f')
  const [tag, setTag] = useState('normal')
  const [duration, setDuration] = useState('90')
  const [nickname, setNickname] = useState('민트')
  const [content, setContent] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)

  return (
    <PageLayout
      header={
        <PageHeader
          title="공용 컴포넌트"
          onBack={() => undefined}
          right={
            <Button size="sm" variant="soft">
              등록
            </Button>
          }
        />
      }
      footer={<Button fullWidth size="lg">예약하기</Button>}
      bottomNav={<BottomNav active="home" />}
      flush
    >
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'all', label: '전체' },
          { value: 'qna', label: '질문정보' },
        ]}
      />

      <div className="flex flex-col gap-4 px-4 py-4">
        <Card className="flex flex-col gap-3">
          <SectionHeader
            title="버튼 / 뱃지"
            actionLabel="전체 보기"
            onAction={() => undefined}
          />
          <div className="flex flex-wrap gap-2">
            <Button>primary</Button>
            <Button variant="outline">outline</Button>
            <Button variant="danger">danger</Button>
            <Button variant="dangerOutline">예약 취소</Button>
            <Button variant="kakao">카카오로 계속하기</Button>
            <Button disabled>disabled</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="gray">일반</Badge>
            <Badge tone="orange">질문</Badge>
            <Badge tone="blue">정보</Badge>
            <Badge tone="green">예약 완료</Badge>
            <Badge tone="yellow">아침</Badge>
            <Badge tone="purple">저녁</Badge>
            <Badge tone="red" size="sm">
              2
            </Badge>
          </div>
        </Card>

        <Card padded={false} className="divide-y divide-line overflow-hidden">
          <ListRow
            icon={<IconBox><WashingMachine /></IconBox>}
            title="세탁 · 건조기"
            description="세탁기 4/6대 · 건조기 3/4대 이용 가능"
            onClick={() => undefined}
          />
          <ListRow
            icon={<IconBox><CalendarDays /></IconBox>}
            title="알림"
            right={<Badge tone="red" size="sm">2</Badge>}
            onClick={() => undefined}
          />
          <ListRow
            icon={<Bell className="size-5 text-danger" />}
            title="회원 탈퇴"
            danger
            onClick={() => undefined}
          />
        </Card>

        <Card selected className="flex items-center gap-3">
          <Avatar name="민트" solid size="lg" />
          <div className="flex-1">
            <p className="font-bold">민트 (나)</p>
            <p className="text-sm text-ink-mute">~ 22:10 완료 예정</p>
          </div>
          <Avatar name="코코" />
          <Avatar name="라떼" />
        </Card>

        <Card className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-ink-sub">남은 시간</p>
          <ProgressBar value={65} />
          <InfoBox>이용 등록 후 설정한 시간이 지나면 완료 알림이 와요.</InfoBox>
          <InfoBox tone="success">카카오 계정 확인이 끝났어요.</InfoBox>
        </Card>

        <Card className="flex flex-col gap-4">
          <SegmentedControl
            variant="soft"
            value={board}
            onChange={setBoard}
            options={[
              { value: 'all', label: '전체 게시판' },
              { value: 'qna', label: '질문정보 게시판' },
            ]}
          />
          <SegmentedControl
            variant="pill"
            value={tag}
            onChange={setTag}
            options={[
              { value: 'normal', label: '일반' },
              { value: 'question', label: '질문' },
              { value: 'info', label: '정보' },
            ]}
          />
          <SegmentedControl
            variant="solid"
            value={gender}
            onChange={setGender}
            options={[
              { value: 'm', label: '남' },
              { value: 'f', label: '여' },
            ]}
          />
          <SegmentedControl
            columns={3}
            value={duration}
            onChange={setDuration}
            options={[
              { value: '30', label: '30분' },
              { value: '60', label: '1시간' },
              { value: '90', label: '1시간 30분' },
              { value: '120', label: '2시간' },
              { value: '150', label: '2시간 30분' },
              { value: '180', label: '3시간' },
            ]}
          />
        </Card>

        <Card className="flex flex-col gap-4">
          <TextField
            label="별명"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            status="success"
            helper="사용할 수 있는 별명이에요."
            action={<Button size="sm" variant="outline">중복 확인</Button>}
          />
          <TextField
            label="이메일"
            placeholder="example@email.com"
            status="error"
            helper="이메일 형식이 올바르지 않아요."
          />
          <TextArea
            label="내용"
            placeholder="내용을 입력하세요"
            rows={4}
            maxLength={2000}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </Card>

        <Card padded={false}>
          <EmptyState
            icon={<Bell />}
            title="아직 알림이 없어요"
            description="새 소식이 생기면 여기에 표시돼요."
          />
        </Card>

        <Button variant="dangerOutline" onClick={() => setModalOpen(true)}>
          확인 모달 열기
        </Button>
      </div>

      <ConfirmModal
        open={modalOpen}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴하면 계정을 복구할 수 없어요."
        confirmLabel="탈퇴하기"
        confirmDisabled={!agreed}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
      >
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="size-5"
          />
          위 내용을 확인했어요.
        </label>
      </ConfirmModal>
    </PageLayout>
  )
}
