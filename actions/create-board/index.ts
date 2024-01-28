"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId ) {
        return {
            error: "권한 없음",
        };
    }

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
