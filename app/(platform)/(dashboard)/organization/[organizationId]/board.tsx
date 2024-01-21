import { Button } from "@/components/ui/button";

interface BoardProps {
    id: string;
    title: string;
}

export default function Board({id, title}: BoardProps) {
    return (
        <form className="flex items-center gap-x-2">
            <p>
                board title: {title}
            </p>
            <Button
                type="submit" 
                variant="destructive" 
                size="sm"
            >
                삭제 
            </Button>
        </form>
    )
}