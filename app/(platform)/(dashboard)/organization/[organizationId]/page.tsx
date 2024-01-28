import { Separator } from "@/components/ui/separator";
import Info from "./_components/info";
import BoardList from "./_components/board-list";
import { Suspense } from "react";

const OrganizationIdPage = async () => {

    return (
        <div className="w-full mb-20">
            {/* 인포 */}
            <Info />
            {/* 분리선 */}
            <Separator className="my-4" />
            {/* 보드 목록 */}
            <div className="px-2 md:px-4">
                <Suspense fallback={<BoardList.Skeleton />}>
                    <BoardList />
                </Suspense>
            </div>
        </div>
    )
};

export default OrganizationIdPage;