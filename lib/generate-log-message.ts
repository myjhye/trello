import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `${entityType.toLowerCase()} "${entityTitle}" 생성`;
    case ACTION.UPDATE:
      return `${entityType.toLowerCase()} "${entityTitle}" 수정`;
    case ACTION.DELETE:
      return `${entityType.toLowerCase()} "${entityTitle}" 삭제`;
    default:
      return `알 수 없는 액션 : ${entityType.toLowerCase()} "${entityTitle}"`;
  };
};