import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/board-navbar";

// 메타데이터
export async function generateMetadata({params}: {params: {boardId: string}}) {

    // 현재 사용자의 orgId 가져오기
    const { orgId } = auth();

    // orgId가 없으면 기본 제목 "Board" 설정
    if (!orgId) {
        return {
            title: "Board",
        }
    }

    // 데이터베이스에서 보드 상세 데이터 가져와 메타데이터의 title로 설정
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        }
    });

    return {
        title: board?.title || "Board",
    }
}

export default async function BoardIdLayout({children, params}: {
    children: React.ReactNode; 
    params: {boardId: string}
}) {

    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    };

    // 보드 상세 데이터
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        }
    });

    if (!board) {
        notFound();
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})`}}
        >
            <BoardNavbar data={board} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    );
};