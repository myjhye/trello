"use client";

import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function ListContainer({boardId, data}: ListContainerProps) {

    // 목록 데이터
    const [orderedData, setOrderedData] = useState(data);

    // 목록 재배치
    const { execute: executeUpdateListOrder} = useAction(updateListOrder, {
      onSuccess: () => {
        toast.success("목록 재배치됨");
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    // 카드 재배치
    const { execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
      onSuccess: () => {
        toast.success("목록 재배치됨");
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    // 목록 데이터 변경 시마다 (생성, 수정, 삭제) 화면 업데이트
    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result: any) => {
      const { destination, source, type } = result;

      if (!destination) {
        return;
      };

      // 같은 위치에 뒀을 때
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }

      // 목록을 옮겼을 때
      if (type === "list") {
        const items = reorder (
          orderedData,
          source.index,
          destination.index,
        ).map((item, index) => ({ ...item, order: index }));

        setOrderedData(items);

        // 서버에 상태 저장 -> 목록 재배치
        executeUpdateListOrder({ items, boardId });

      }

      // 카드를 옮겼을 때
      if (type === "card") {
        let newOrderedData = [ ...orderedData ];

        const sourceList = newOrderedData.find(list => list.id === source.droppableId);
        const destList = newOrderedData.find(list => list.id === destination.droppableId);

        if (!sourceList || !destList) {
          return;
        }

        // 목록에 카드가 없을 때
        if (!sourceList.cards) {
          sourceList.cards = [];
        }

        if (!destList.cards) {
          destList.cards = [];
        }

        // 카드를 같은 목록 내에서 옮길 때
        if (source.droppableId === destination.droppableId) {
          const reorderedCard = reorder(
            sourceList.cards,
            source.index,
            destination.index,
          );

          reorderedCard.forEach((card, idx) => {
            card.order = idx;
          });

          sourceList.cards = reorderedCard;

          setOrderedData(newOrderedData);

          // 서버에 상태 저장 -> 카드를 같은 목록에 재배치
          executeUpdateCardOrder({ 
            boardId,
            items: reorderedCard, 
          });

        // 카드를 다른 목록에 옮길 때  
        } else {
          
          // 목록에서 카드 제거
          const [movedCard] = sourceList.cards.splice(source.index, 1);

          // 이동한 카드에 새 listId 부여
          movedCard.listId = destination.droppableId;

          // 이동한 카드를 다른 목록에 추가
          destList.cards.splice(destination.index, 0, movedCard);

          sourceList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          // 목록의 카드 순서 업데이트
          destList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          setOrderedData(newOrderedData);

          // 서버에 상태 저장 -> 카드를 같은 목록에 재배치
          executeUpdateCardOrder({ 
            boardId,
            items: destList.cards, 
          });
          
        }
      }
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
          <Droppable 
            droppableId="lists" 
            type="list" 
            direction="horizontal"
          >
            {(provided) => (
              <ol
                { ...provided.droppableProps }
                ref={provided.innerRef} 
                className="flex gap-x-3 h-full"
              >
                  {/* 보드 목록 */}
                  {orderedData.map((list, index) => {
                    return (
                      <ListItem
                        key={list.id}
                        index={index}
                        data={list}
                      />
                    )
                  })}
                  {provided.placeholder}
                  {/* 보드 입력 */}
                  <ListForm />
                  <div className="flex-shrink-0 w-1" />
              </ol>
            )}
          </Droppable>
        </DragDropContext>
    )
}