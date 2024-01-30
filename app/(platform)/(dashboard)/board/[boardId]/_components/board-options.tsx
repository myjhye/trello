"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

interface BoardOptionsProps {
    id: string;
};

export default function BoardOptions({ id }: BoardOptionsProps) {

    const { execute, isLoading } = useAction(deleteBoard, {
        onError: (error) => {
            toast.error(error);
        }
    });

    const onDelete = () => {
        execute({ id });
    }

    return (
        <Popover>
            {/* 팝오버 클릭 */}
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            {/* 팝오버 내용 */}
            <PopoverContent className="px-0 pt-3" side="bottom" align="start">
                {/* 내용 */}
                <div className="text-sm font-medium text-center text-neutral-600">
                    Board actions
                </div>
                {/* 닫기 */}
                <PopoverClose asChild>
                    <Button 
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                {/* 삭제 */}
                <Button 
                    variant="ghost"
                    onClick={onDelete}
                    disabled={isLoading}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                >
                    보드 삭제
                </Button>
            </PopoverContent>
        </Popover>
    )
}