"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";

// InputType 형식의 data를 받고, ReturnType을 비동기로(Promise) 반환
const handler = async (data: InputType): Promise<ReturnType> => {
    
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "권한 없음",
        };
    }

    // data (입력 데이터)에서 title, boardId 추출
    const { title, boardId } = data;
    let list;

    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId,
            },
        });

        if (!board) {
            return {
                error: "보드 없음",
            };
        }

        const lastList = await db.list.findFirst({
            where: { 
                boardId: boardId 
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data: {
                boardId,
                title,
                order: newOrder,
            },
        });
    } catch (error) {
        return {
            error: "생성 실패"
        }
    }

    // 생성 후 보드 상세 페이지 재생성
    revalidatePath(`/board/${boardId}`);

    // data 객체에 업데이트된 'list' 반환
    return { data: list };

};

// createList = createSafeAction으로 CreateList 함수의 데이터 유효성 검사를 중앙에서 처리해 handler에 전달
export const createList = createSafeAction(CreateList, handler);