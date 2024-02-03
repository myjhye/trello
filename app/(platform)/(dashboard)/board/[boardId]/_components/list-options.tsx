"use client";

import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
    data: List;
    onAddCard: () => void;
};

export default function ListOptions({data, onAddCard}: ListOptionsProps) {

    const closeRef = useRef<ElementRef<"button">>(null);
    
    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`리스트 "${data.title}" 삭제됨`);
            closeRef.current?.click();
        },
        onError: (error) => {
            toast.error(error);
        },
    });
    
    const onDelete = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeDelete({ id, boardId });
    };
    
    return (
        <Popover>
            <PopoverTrigger>
                <Button className="h-auto w-auto p-2" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600">
                    ddd
                </div>
                {/* asChild 사용 이유 : 아래 스타일링 적용 위해 */}
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button
                    onClick={onAddCard}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    variant="ghost"
                >
                    카드 추가
                </Button>
                <form>
                    <input id="id" name="id" value={data.id} hidden />
                    <input id="boardId" name="boardId" value={data.boardId} hidden />
                    <FormSubmit 
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        복사
                    </FormSubmit>
                </form>
                <Separator />
                <form action={onDelete} >
                    <input id="id" name="id" value={data.id} hidden />
                    <input id="boardId" name="boardId" value={data.boardId} hidden />
                    <FormSubmit 
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        리스트 삭제
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}