"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";

// InputType 형식의 data를 받고, ReturnType을 비동기로(Promise) 반환
const handler = async (data: InputType): Promise<ReturnType> => {
    
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "권한 없음",
        };
    }

    // data (입력 데이터)에서 title, id 추출
    const { title, id } = data;
    let board;

    try {
        board = await db.board.update({
            where: {
                id,
                orgId,
            },
            data: {
                title,
            }
        })
    } catch (error) {
        return {
            error: "수정 실패"
        }
    }

    // 수정 후 보드 상세 페이지 재생성
    revalidatePath(`/board/${id}`);

    // data 객체에 업데이트된 'board' 반환
    return { data: board };

};

// updateBoard = createSafeAction으로 UpdateBoard 함수의 데이터 유효성 검사를 중앙에서 처리해 handler에 전달
export const updateBoard = createSafeAction(UpdateBoard, handler);