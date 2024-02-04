import { z } from "zod";

export const UpdateCard = z.object({

    id: z.string(),
    boardId: z.string(),
    description: z.optional(
        z.string({
            required_error: "내용 입력 필요",
            invalid_type_error: "내용 입력 필요",
        }).min(3, {
            message: "내용이 너무 짧습니다"
        }),
    ),
    title: z.string({
        required_error: "제목 입력 필요",
        invalid_type_error: "제목 입력 필요",
    }).min(3, {
        message: "제목이 너무 짧습니다"
    }),
    
});