import { startCase } from "lodash";
import { OrgControl } from "./_components/org-control";
import { auth } from "@clerk/nextjs";

// 메타데이터
export async function generateMetadata() {
    const { orgSlug } = auth();

    return {
        // 조직 슬러그를 title로 변환해 반환하고, 조직 슬러그가 없으면 기본 값으로 "organization" 사용
        title: startCase(orgSlug || "organization"),
    }
}

export default function OrganizationIdLayout ({children}: {children: React.ReactNode;}) {
    return (
        <>
            {/* 선택한 조직 활성화 */}
            <OrgControl />
            {/* 선택한 조직 정보 표시 */}
            {children}
        </>
    )
}