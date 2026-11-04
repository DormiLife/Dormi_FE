import { useNavigate } from "@tanstack/react-router";
import { Heart, PenLine } from "lucide-react";
import { useState } from "react";
import { BoardPostList } from "@/components/board/BoardPostList";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import { CURRENT_USER_NICKNAME } from "@/lib/board";
import { useBoardPosts } from "@/lib/boardStore";

type Tab = "written" | "liked";

export function MyActivityPage() {
  const navigate = useNavigate();
  const allPosts = useBoardPosts();
  const [tab, setTab] = useState<Tab>("written");

  // TODO: API 연동 시 내가 쓴 글 / 좋아요한 글 조회로 교체
  const written = allPosts.filter((p) => p.author === CURRENT_USER_NICKNAME);
  const liked = allPosts.filter((p) => p.liked);
  const posts = tab === "written" ? written : liked;

  return (
    <PageLayout
      header={
        <PageHeader
          title="내 게시판 활동"
          centered
          onBack={() => navigate({ to: "/my" })}
        />
      }
      flush
    >
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "written", label: `내가 쓴 글 ${written.length}` },
          { value: "liked", label: `좋아요한 글 ${liked.length}` },
        ]}
      />

      {posts.length === 0 ? (
        tab === "written" ? (
          <EmptyState
            icon={<PenLine />}
            title="아직 작성한 글이 없어요"
            description="게시판에 첫 글을 남겨 보세요."
            action={
              <Button onClick={() => navigate({ to: "/board/new" })}>
                글쓰기
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Heart />}
            title="좋아요한 글이 없어요"
            description="마음에 드는 글에 하트를 눌러 보세요."
          />
        )
      ) : (
        <div className="mt-2 border-y border-line">
          <BoardPostList
            posts={posts}
            onPostClick={(postId) =>
              navigate({ to: "/board/$postId", params: { postId } })
            }
          />
        </div>
      )}
    </PageLayout>
  );
}
