import { z } from "zod";

export const CreateCard = z.object({
    title: z.string({
        required_error: "제목 입력 필요",
        invalid_type_error: "제목 입력 필요",
    }).min(3, {
        message: "제목이 너무 짧습니다"
    }),
    boardId: z.string(),
    listId: z.string(),
});