"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { toast } from "sonner";
import FormPicker from "./form-picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
};

export default function FormPopover({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
} : FormPopoverProps) {

    const proModal = useProModal();
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("보드 생성됨");
            // 보드 생성 후 창 닫기
            closeRef.current?.click();
            // 보드 생성 후 해당 보드로 이동
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            console.log({ error });
            toast.error(error);
            // 보드 생성 에러 시 업그레이드 권유 팝업 표시
            proModal.onOpen();
        }
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({ title, image });
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    보드 생성
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button 
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                {/* 폼 제출 */}
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        {/* unsplash 이미지들 */}
                        <FormPicker 
                            id="image"
                            errors={fieldErrors}
                        />
                        {/* 보드 제목 입력칸 */}
                        <FormInput 
                            id="title"
                            label="보드 제목"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">
                        저장
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}