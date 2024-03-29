"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import decreaseAvailableCount from "@/lib/org-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
    
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "권한 없음",
        };
    }

    const { id } = data;
    let board;

    try {
        board = await db.board.delete({
            where: {
                id,
                orgId,
            },
        });

        // 보드 삭제 후 보드 생성 수 증가
        await decreaseAvailableCount();

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
        });

    } catch (error) {
        return {
            error: "삭제 실패"
        }
    }

    revalidatePath(`/organization/${orgId}`);
    // 보드 삭제 후 조직 목록으로 이동
    redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);