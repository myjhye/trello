"use client";

import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

export default function ListContainer({boardId, data}: ListContainerProps) {

    // 목록 데이터
    const [orderedData, setOrderedData] = useState(data);

    // 목록 데이터 변경 시마다 (생성, 수정, 삭제) 화면 업데이트
    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    return (
      <DragDropContext onDragEnd={() => {}}>
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