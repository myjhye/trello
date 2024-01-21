"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
    errors?: {
        title?: string[];
    },
    message?: string | null;
}

const CreateBoard = z.object({
    title: z.string().min(3, {
        message: "3자 이상 입력 필요"
    }),
});

export async function create(prevState: State, formData: FormData) {
    const validatedFields = CreateBoard.safeParse({
        title: formData.get("title"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "필드가 없습니다"
        }
    }

    const { title } = validatedFields.data;

    try {
        await db.board.create({
            data: {
                title,
            }
        });
    } catch (error) {
        return {
            message: "데이터베이스 에러",
        }
    }

    revalidatePath("/organization/org_2bDGDVYCneTNkWeRTPPvoBBL4GX");
    redirect("/organization/org_2bDGDVYCneTNkWeRTPPvoBBL4GX");
}