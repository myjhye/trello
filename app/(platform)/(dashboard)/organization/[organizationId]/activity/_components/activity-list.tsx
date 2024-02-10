import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

export const ActivityList = async () => {
    
    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    };

    const auditLogs = await db.auditLog.findMany({
        where: {
            orgId,
        },
        // 처음한 게 가장 밑으로
        orderBy: {
            createdAt: "desc",
        },
    });
    
    return (
        <ol className="space-y-4 mt-4">
            <p className="hidden last:block text-xs text-center text-muted-foreground">
                현재 조직에서 활동 내역이 없습니다
            </p>
            {auditLogs.map((log) => (
                <ActivityItem 
                    key={log.id}
                    data={log}
                />
            ))}                
        </ol>
    );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
    return (
        <ol className="space-y-4 mt-4">
            <Skeleton className="w-[80%] h-14" />
            <Skeleton className="w-[50%] h-14" />
            <Skeleton className="w-[70%] h-14" />
            <Skeleton className="w-[80%] h-14" />
            <Skeleton className="w-[75%] h-14" />
        </ol>
    );
};