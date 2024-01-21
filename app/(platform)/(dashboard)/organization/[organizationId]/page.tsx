import { create } from "@/\bactions/create-board";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Board from "./board";

export default async function OrganizationIdPage() {
    const boards = await db.board.findMany();

    return (
        <div className="flex flex-col space-y-4">
            <form action={create}>
                <input 
                    id="title"
                    name="title"
                    required
                    placeholder="제목 입력"
                    className="border-black border p-1"
                />
                <Button type="submit">
                    입력
                </Button>
            </form>
            <div className="space-y-2">
                {boards.map((board) => (
                    <Board
                        key={board.id} 
                        id={board.id}
                        title={board.title} 
                    />
                ))}
            </div>
        </div>
    )
}