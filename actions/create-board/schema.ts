import { z } from "zod";

export const CreateBoard = z.object({
    
    title: z.string({
        required_error: "제목 입력 필요",
        invalid_type_error: "제목 입력 필요",
    }).min(3, {
        message: "제목이 너무 짧습니다"
    }),

    image: z.string({
        required_error: "이미지 입력 필요",
        invalid_type_error: "이미지 입력 필요",
    }),
});