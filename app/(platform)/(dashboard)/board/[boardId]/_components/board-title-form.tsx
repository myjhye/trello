"use client";

import { updateBoard } from "@/actions/update-board";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface BoardTitleFormProps {
    data: Board;
}

export default function BoardTitleForm({data}: BoardTitleFormProps) {

    const { execute } = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`보드 "${data.title}" 수정됨`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    // 편집 모드
    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            // 입력칸 포커스
            inputRef.current?.focus();
            // 입력칸의 텍스트 모두선택
            inputRef.current?.select();
        })
    };

    // 편집 모드 비활성화
    const disableEditing = () => {
        setIsEditing(false);
    };

    // 폼 제출
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        execute({
            id: data.id,
            title,
        });
    };

    // input 요소 클릭 후 외부 영역 클릭 시 변경된 텍스트 제출
    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    // 편집 모드인 경우
    if (isEditing) {
        return (
            <form
                action={onSubmit} 
                ref={formRef} 
                className="flex items-center gap-x-2"
            >
                <FormInput
                    ref={inputRef} 
                    id="title"
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }

    // 편집 모드가 아닌 경우
    return (
        <Button
            onClick={enableEditing}
            variant="transparent" 
            className="font-bold text-lg h-auto w-auto p-1 px-2"
        >
            {title}
        </Button>
    )
}