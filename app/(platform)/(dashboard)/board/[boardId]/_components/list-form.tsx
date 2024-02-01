"use client";

import { Plus, X } from "lucide-react";
import ListWrapper from "./list-wrapper";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export default function ListForm() {
    const router = useRouter();
    const params = useParams();

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    // 편집 모드
    const [isEditing, setIsEditing] = useState(false);

    // 편집 모드 활성화
    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    // 편집 모드 비활성화
    const disableEditing = () => {
        setIsEditing(false);
    };

    // 서버 요쳥을 위해 execute 호출 - useAction으로 createList 실행
    const { execute, fieldErrors } = useAction(createList, {
        
        // 서버 응답
        onSuccess: (data) => {
            toast.success(`목록 "${data.title}" 생성됨 `);
            disableEditing();
            router.refresh();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    // Esc 키 누르면 편집 모드 비활성화
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        };
    };

    // 키보드 이벤트
    useEventListener("keydown", onKeyDown);
    // form 외부 클릭 시 편집 모드 비활성화
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;

        // 서버 요청
        execute({
            title,
            boardId
        });
    }

    // 편집 모드인 경우 아래 jdx 렌더링
    if (isEditing) {
        return (
          <ListWrapper>
            <form
              action={onSubmit}
              ref={formRef}
              className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
            >
              <FormInput
                ref={inputRef}
                errors={fieldErrors}
                id="title"
                className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                placeholder="제목 입력"
              />
              <input 
                hidden
                value={params.boardId}
                name="boardId"
              />
              <div className="flex items-center gap-x-1">
                <FormSubmit>
                    리스트 추가
                </FormSubmit>
                <Button 
                    onClick={disableEditing}
                    size="sm"
                    variant="ghost"
                >
                    <X className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </ListWrapper>
        );
      };

    // 편집 모드가 아닌 경우 아래 jdx 렌더링
    return (
        <ListWrapper>
            <button
                onClick={enableEditing} 
                className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
            >
                <Plus className="h-4 w-4 mr-2" />
                리스트 추가
            </button>
        </ListWrapper>
    )
}