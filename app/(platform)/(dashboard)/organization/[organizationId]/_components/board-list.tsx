import FormPopover from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { HelpCircle, User2 } from "lucide-react";

export default function BoardList() {
    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="h-6 w-6 mr-2" />
                Your boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* 팝오버 */}
                <FormPopover sideOffset={10} side="right">
                    <div 
                        role="button"
                        className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                    >
                        <p>새 보드 생성</p>
                        <span className="text-sm">
                            5개 남음
                        </span>
                        <Hint
                            sideOffset={40}
                            description={`
                                무료 워크스페이스에서는 최대 5개의 보드 생성 가능. 무제한 보드를 사용하려면 업그레이드.
                            `}
                        >
                            <HelpCircle 
                                className="absolute bottom-2 right-2 h-[14px] w-[14px]"
                            />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    )
}