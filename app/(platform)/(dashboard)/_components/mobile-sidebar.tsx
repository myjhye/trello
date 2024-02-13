"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {

    // 현재 경로
    const pathname = usePathname();
    // 마운트 되었는지 (컴포넌트가 화면에 나타났는지) 여부
    const [isMounted, setIsMounted] = useState(false);

    // 모바일 사이드바 열기
    const onOpen = useMobileSidebar((state) => state.onOpen);
    // 모바일 사이드바 닫기
    const onClose = useMobileSidebar((state) => state.onClose);
    // 모바일 사이드바 열려 있는지 여부
    const isOpen = useMobileSidebar((state) => state.isOpen);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 경로가 변경될 때마다 사이드바 닫기
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // 컴포넌트가 마운트되지 않았으면 아무것도 렌더링 하지 않음
    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Button
                onClick={onOpen}
                className="block md:hidden mr-2"
                variant="ghost"
                size="sm"
            >
                <Menu />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    side="left"
                    className="p-2 pt-10"
                >
                    <Sidebar 
                        storageKey="t-sidebar-mobile-state"
                    />
                </SheetContent>
            </Sheet>
        </>
    )
}