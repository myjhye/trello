// 조직 아이디를 전달 받아 해당 조직 활성화

"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const OrgControl = () => {

    // url 파라미터
    const params = useParams();
    // 사용자가 선택한 조직 활성화(접속)
    const { setActive } = useOrganizationList();

    useEffect(() => {
        if (!setActive) {
            return;
        }
        // 사용자가 조직 선택 시 해당 조직의 id가 url의 파라미터로 설정되고, 이후 setActive를 호출해 해당 조직 활성화
        setActive({
            organization: params.organizationId as string,
        });

    // 사용자가 조직 선택 시, url 파라미터 변경 시
    }, [setActive, params.organizationId]);

    // 현재 컴포넌트는 setActive로 조직을 활성화하지만 실제 화면에는 아무것도 표시하지 않음
    return null;
}