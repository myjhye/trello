"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId ) {
        return {
            error: "권한 없음",
        };
    }

    const canCreate = await hasAvailableCount();

    if (!canCreate) {
        return {
            error: "무료 보드 생성 수를 초과했습니다. 보드를 더 생성하시려면 업그레이드 하세요."
        };
    };

    // 입력 데이터로부터 title, image 추출
    const { title, image } = data;

    // 입력 된 image value 분할해서 사용
    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|");

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
        return {
            error: "필드 작성 부족으로 보드 생성 실패"
        };
    }

    let board;
    
    // 사용자가 입력한 데이터 데이터베이스에 보내기
    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
            }
        });

        // 위 board를 생성한 후 
        await incrementAvailableCount();

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
        });

    } catch (error) {
        return {
            error: "생성 실패",
        };
    }

    // 보드 생성 후 화면 업데이트
    revalidatePath(`/board/${board.id}`);

    // 생성된 보드 데이터 클라이언트에게 반환
    return { data: board };
}

// 보드 생성 외부 사용
export const createBoard  = createSafeAction(CreateBoard, handler);
