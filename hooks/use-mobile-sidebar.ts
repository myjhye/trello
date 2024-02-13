// 모바일 사이드바 상태관리 훅

import { create } from "zustand";

type MobileSidebarStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))