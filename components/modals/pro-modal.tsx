"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";

export default function ProModal() {

    const proModal = useProModal();

    return (
        <Dialog
            open={proModal.isOpen}
            onOpenChange={proModal.onClose}
        >
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div className="aspect-video relative flex items-center jusitfy-center">
                    <Image 
                        src="/hero.svg"
                        alt="Hero"
                        className="objet-cover"
                        fill
                    />
                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2 className="font-semibold text-xl">
                        무료 보드 생성 수를 초과했습니다
                    </h2>
                    <p className="text-s font-semibold text-neutral-600">
                        Taskify Pro 업그레이드로 다음 혜택을 누리세요
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>무제한 보드 생성</li>
                            <li>고급 버전 체크리스트</li>
                            <li>관리자 ˑ 보안 페이지</li>
                            <li>그 외</li>
                        </ul>
                    </div>
                    <Button 
                        className="w-full"
                        variant="primary"
                    >
                        업그레이드
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}