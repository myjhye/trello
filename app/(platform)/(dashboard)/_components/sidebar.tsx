"use client";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { NavItem } from "./nav-item";

interface SidebarProps {
    storageKey?: string;
};

export const Sidebar = ({storageKey = "t-sidebar-state"}: SidebarProps) => {

    // 사이드바 확장상태 -> useLocalStorage 훅 사용해 확장상태 저장
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {});
    
    // 활성화된 조직 (현재 클릭된 조직) 가져오기 -> useOrganization 훅 사용 
    const {
        organization: activeOrganization,
        isLoaded: isLoadedOrg,
    } = useOrganization();
    
    // 생성된 전체 조직목록 가져오기 -> useOrganizationList 훅 사용
    const {
        userMemberships,
        isLoaded: isLoadedOrgList
    } = useOrganizationList({ 
        userMemberships: { 
            infinite: true
        },
    });

    // 아코디언이 확장되어 있는 상태를 기본값으로 제공
    const defaultAccordionValue: string[] = Object.keys(expanded)
        .reduce((acc: string[], key: string) => {
            if (expanded[key]) {
                acc.push(key);
            }
            return acc;
        }, []);

    // 아이템 확장/축소
    const onExpand = (id: string) => {
        setExpanded((curr) => ({
            ...curr,
            [id]: !expanded[id],
        }));
    };

    // 로딩표시, 조직정보가 로드되지 않았으면 스켈레톤 표시
    if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
        return (
            <>
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-10 w-[50%]"/>
                    <Skeleton className="h-10 w-10"/>
                </div>
                <div className="space-y-2">
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                </div>
            </>
        ) 
    }

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">
                    Workspaces
                </span>
                <Button
                    asChild
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                >
                    <Link href="/select-org">
                        <Plus className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <Accordion
                type="multiple"
                defaultValue={defaultAccordionValue}
                className="space-y-2"
            >
                {userMemberships.data.map(({organization}) => (
                    <NavItem
                        key={organization.id}
                        isActive={activeOrganization?.id === organization.id}
                        isExpanded={expanded[organization.id]}
                        organization={organization}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    )
}