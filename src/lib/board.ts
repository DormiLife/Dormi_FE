import type { BadgeTone } from '@/components/ui/Badge'

export type BoardCategory = 'question' | 'info' | 'general'

export const BOARD_CATEGORY_META: Record<
  BoardCategory,
  { label: string; tone: BadgeTone }
> = {
  question: { label: '질문', tone: 'orange' },
  info: { label: '정보', tone: 'info' },
  general: { label: '일반', tone: 'gray' },
}

export interface BoardPost {
  id: string
  category: BoardCategory
  title: string
  author: string
  /** 예: '10/27' */
  date: string
  /** 목록에 한 줄로 보여줄 본문 요약 */
  preview?: string
  likeCount?: number
  commentCount?: number
  /** 상세 화면 본문 */
  content?: string
  /** 상세 화면 작성 일시. 예: '10/26 14:30' */
  createdAt?: string
  /** 내가 좋아요를 눌렀는지 */
  liked?: boolean
}

export interface BoardComment {
  id: string
  author: string
  content: string
  /** 예: '10/26 16:20' */
  createdAt: string
}

/** 로그인 연동 전까지 "내 계정"으로 쓰는 별명 */
export const CURRENT_USER_NICKNAME = '민트'

/** 게시판 화면 목업 데이터. API 연동 전까지 사용 */
export const MOCK_BOARD_POSTS: BoardPost[] = [
  {
    id: '6',
    category: 'question',
    title: '공용 냉장고 이용 규칙이 궁금해요',
    preview: '공용 냉장고에 음식을 넣어도 되는지, 보관 기간이 있는지 궁금해요.',
    content:
      '공용 냉장고에 음식을 넣어도 되는지, 보관 기간이 있는지 궁금해요.\n이름을 적어서 넣어야 하는지도 알려주세요.',
    author: CURRENT_USER_NICKNAME,
    date: '10/28',
    createdAt: '10/28 08:30',
    likeCount: 3,
    commentCount: 1,
  },
  {
    id: '1',
    category: 'question',
    title: '세탁기 이용 시간은 어떻게 되나요?',
    preview: '세탁기 이용 시간이 밤에도 가능한가요? 24시간 이용 가능한가요?',
    content:
      '세탁기 이용 시간이 밤에도 가능한가요? 24시간 이용 가능한가요?\n밤에 돌려도 소음 문제가 없는지도 궁금해요.',
    author: '코코',
    date: '10/27',
    createdAt: '10/27 09:10',
    likeCount: 12,
    commentCount: 2,
  },
  {
    id: '2',
    category: 'info',
    title: '기숙사 주변 편의시설 공유해요!',
    preview: '근처에 괜찮은 맛집, 카페, 마트 등이 있어서 공유해요.',
    content:
      '기숙사 근처에 괜찮은 맛집, 카페, 마트 등이 있어서 공유해요.\n혹시 주변에 다른 좋은 곳 있으면 댓글로 남겨주세요.',
    author: '하늘',
    date: '10/26',
    createdAt: '10/26 14:30',
    likeCount: 7,
    commentCount: 3,
    liked: true,
  },
  {
    id: '3',
    category: 'general',
    title: '이번 주말 같이 공부하실 분 계세요?',
    preview: '다음 주 시험이라 같이 공부하실 분 찾아요! 회의실 예약해 둘게요.',
    content:
      '다음 주 시험이라 같이 공부하실 분 찾아요! 회의실 예약해 둘게요.\n토요일 오후 2시부터 생각하고 있어요.',
    author: '라떼',
    date: '10/25',
    createdAt: '10/25 20:45',
    likeCount: 8,
    commentCount: 1,
  },
  {
    id: '4',
    category: 'question',
    title: '분실물은 어디에 신고하나요?',
    preview: '세탁실에서 이어폰을 잃어버렸는데 어디에 문의하면 될까요?',
    content: '세탁실에서 이어폰을 잃어버렸는데 어디에 문의하면 될까요?',
    author: '모모',
    date: '10/24',
    createdAt: '10/24 18:02',
    likeCount: 5,
    commentCount: 0,
  },
  {
    id: '5',
    category: 'question',
    title: '회의실 예약 취소는 어떻게 하나요?',
    preview: '잘못 예약했는데 취소 방법을 모르겠어요.',
    content: '잘못 예약했는데 취소 방법을 모르겠어요.',
    author: '하늘',
    date: '10/23',
    createdAt: '10/23 11:20',
    likeCount: 2,
    commentCount: 1,
  },
]

/** 게시글 id별 목업 댓글 */
export const MOCK_BOARD_COMMENTS: Record<string, BoardComment[]> = {
  '6': [
    { id: 'c6-1', author: '하늘', content: '이름이랑 날짜 적어서 넣으면 돼요.', createdAt: '10/28 09:15' },
  ],
  '1': [
    { id: 'c1-1', author: '하늘', content: '24시간 이용 가능해요!', createdAt: '10/27 09:40' },
    { id: 'c1-2', author: '민트', content: '밤 11시 이후에는 조용히 써 달라고 안내가 있었어요.', createdAt: '10/27 10:05' },
  ],
  '2': [
    { id: 'c2-1', author: '코코', content: '오 여기 진짜 좋아요! 저도 자주 가요', createdAt: '10/26 15:12' },
    { id: 'c2-2', author: '라떼', content: '마트는 어디에 있나요?', createdAt: '10/26 16:03' },
    { id: 'c2-3', author: '민트', content: '정문 쪽으로 5분만 걸어가면 있어요.', createdAt: '10/26 16:20' },
  ],
  '3': [
    { id: 'c3-1', author: '코코', content: '저 참여할게요!', createdAt: '10/25 21:10' },
  ],
  '4': [],
  '5': [
    { id: 'c5-1', author: '모모', content: '예약 상세 화면에서 취소할 수 있어요.', createdAt: '10/23 12:00' },
  ],
}
