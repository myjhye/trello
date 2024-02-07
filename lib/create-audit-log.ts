import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "./db";

interface Props {
    entityId: string;
    entityType: ENTITY_TYPE,
    entityTitle: string,
    action: ACTION;
};

export const createAuditLog = async (props: Props) => {
    try {
        const { orgId } = auth();
        const user = await currentUser();

        if (!user || !orgId) {
            throw new Error("유저가 없습니다");
        }

        // props에서 활동로그에 필요한 정보 추출
        const { entityId, entityType, entityTitle, action } = props;

        // 데이터베이스에 활동로그 생성
        await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user?.imageUrl,
                userName: user?.firstName + " " + user?.lastName,
            }
        })


    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error);
    }
}