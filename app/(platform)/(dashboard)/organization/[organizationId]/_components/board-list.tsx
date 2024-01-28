import FormPopover from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BoardList() {

    // 사용자의 orgId 가져오기
    const { orgId } = auth();

    // orgId가 없으면 /select-org으로 리다이렉트
    if (!orgId) {
        return redirect("/select-org");
    }

    // 사용자의 orgId에 해당하는 보드 목록 가져오기
    const boards = await db.board.findMany({
        where: {
            orgId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="space-y-4">
          <div className="flex items-center font-semibold text-lg text-neutral-700">
            <User2 className="h-6 w-6 mr-2" />
                Your boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* 보드목록 */}
                {boards.map((board) => (
                <Link
                    key={board.id}
                    href={`/board/${board.id}`}
                    className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                    style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
                >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                    <p className="relative font-semibold text-white">
                        {board.title}
                    </p>
                </Link>
                ))}
                {/* 팝오버 */}
                <FormPopover sideOffset={10} side="right">
                    <div 
                        role="button"
                        className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                    >
                        <p>새 보드 생성</p>
                        <span className="text-sm">
                            5개 남음
                        </span>
                        <Hint
                            sideOffset={40}
                            description={`
                                무료 워크스페이스에서는 최대 5개의 보드 생성 가능. 무제한 보드를 사용하려면 업그레이드.
                            `}
                        >
                            <HelpCircle 
                                className="absolute bottom-2 right-2 h-[14px] w-[14px]"
                            />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    )
};

// 스켈레톤
BoardList.Skeleton = function SkeletonBoardList() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2" />
            <Skeleton className="aspect-video h-full w-full p-2" />
        </div>
    );
};