"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "권한 없음",
        };
    }

    const { id,  boardId } = data;
    let list;

    try {
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
            include: {
                cards: true,
            },
        });

        if (!listToCopy) {
            return { error: "복사할 목록 없음" };
        };

        const lastList = await db.list.findFirst({
            where : { boardId },
            orderBy: { order: "desc" },
            select: { order: true }, 
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - 복사본`,
                order: newOrder,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order, 
                        })),
                    },
                },
            },
            include: {
                cards: true,
            },
        });

    } catch (error) {
        return {
            error: "복제 실패"
        }
    }

    revalidatePath(`/board/${boardId}`);
    // 보드 목록 복제 후 조직 목록으로 이동
    return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);