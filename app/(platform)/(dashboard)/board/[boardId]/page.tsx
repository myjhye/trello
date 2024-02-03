import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ListContainer from "./_components/list-container";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
};

export default async function BoardIdPage({params}: BoardIdPageProps) {

    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    // 보드의 모든 리스트와 각 리스트에 포함된 카드 조회
    const lists = await db.list.findMany({
        where: {
            // 해당 boardId에 속한 리스트 조회
            boardId: params.boardId,
            // 해당 orgId에 속한 보드의 리스트 조회
            board: {
                orgId,
            },
        },
        // 각 리스트에 속한 카드도 결과에 포함
        include: {
            cards: {
                // 카드 오름차순 정렬
                orderBy: {
                    order: "asc",
                },
            },
        },
        // 리스트 오름차순 정렬
        orderBy: {
            order: "asc",
        },
    });

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer 
                boardId={params.boardId}
                data={lists}
            />
        </div>
    );
};