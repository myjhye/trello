import { z } from "zod";

// 입력 데이터의 유효성 검사
export type FieldErrors<T> = {
    [K in keyof T]?: string[];
};

// 전송 결과 정의
export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error?: string | null;
    data?: TOutput;
};

// 전송
export const createSafeAction = <TInput, TOutput> (
    schema: z.Schema<TInput>,
    handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
    return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {

        // 입력 정보의 양식 검사 
        const validationResult = schema.safeParse(data);

        // 입력 정보 양식 올바르지 않을 때 fieldErrors 반환
        if (!validationResult.success) {
            return {
                fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>,
            };
        }

        // 양식 검사가 끝난 정보 전송
        return handler(validationResult.data);
    }
}