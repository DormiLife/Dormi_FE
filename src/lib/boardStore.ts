import { useSyncExternalStore } from 'react'
import {
  CURRENT_USER_NICKNAME,
  MOCK_BOARD_POSTS,
  type BoardCategory,
  type BoardPost,
} from '@/lib/board'

/**
 * 게시글 목록을 화면 사이에서 공유하는 임시 메모리 저장소.
 * API 연동 전까지만 사용하며, 새로고침하면 목업 상태로 돌아간다.
 */
let posts: BoardPost[] = [...MOCK_BOARD_POSTS]
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return posts
}

export function useBoardPosts() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export interface NewPostInput {
  category: BoardCategory
  title: string
  content: string
}

export function updateBoardPost(id: string, input: NewPostInput) {
  posts = posts.map((post) =>
    post.id === id
      ? {
          ...post,
          ...input,
          preview: input.content.replace(/\s+/g, ' ').slice(0, 80),
        }
      : post,
  )
  listeners.forEach((listener) => listener())
}

export function addBoardPost({ category, title, content }: NewPostInput) {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${now.getMonth() + 1}/${now.getDate()}`
  const post: BoardPost = {
    id: `p-${now.getTime()}`,
    category,
    title,
    content,
    preview: content.replace(/\s+/g, ' ').slice(0, 80),
    author: CURRENT_USER_NICKNAME,
    date,
    createdAt: `${date} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    likeCount: 0,
    commentCount: 0,
  }
  posts = [post, ...posts]
  listeners.forEach((listener) => listener())
  return post
}
