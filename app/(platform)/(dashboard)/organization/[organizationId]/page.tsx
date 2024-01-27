import { Separator } from "@/components/ui/separator";
import Info from "./_components/info";
import BoardList from "./_components/board-list";

const OrganizationIdPage = async () => {

    return (
        <div className="flex flex-col space-y-4">
            {/* 인포 */}
            <Info />
            {/* 분리선 */}
            <Separator className="my-4" />
            {/* 보드 목록 */}
            <div className="px-2 md:px-4">
                <BoardList />
            </div>
        </div>
    )
};

export default OrganizationIdPage;