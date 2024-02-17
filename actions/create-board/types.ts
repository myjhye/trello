import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

export type InputType = z.infer<typeof CreateBoard>;
export type ReturnType = ActionState<InputType, Board>;


// CreateBoard 스키마에서 파생된 입력 유형 InputType과 보드를 출력으로 반환하는 ActionState 정의
