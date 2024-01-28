"use client";

import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { defaultImages } from "@/constants/images";
import Link from "next/link";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
};

export default function FormPicker({id, errors}: FormPickerProps) {

    const { pending } = useFormStatus();

    //const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages);
    const [images, setImages] = useState<Array<Record<string, any>>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState(null);
    
    // 화면 렌더링 시 이미지 데이터 비동기로 가져오기
    useEffect(() => {
        const fetchImages = async () => { 
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9,
                });

                if (result && result.response) {
                    const newImages = (result.response as Array<Record<string, any>>);
                    setImages(newImages);
                } else {
                    console.error("사진 불러오기 실패");
                }

            } 
            catch (error) {
                console.error(error);
                //setImages(defaultImages);
                setImages([]);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchImages();

    }, []);

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                            pending && "opacity-50 hover:opacity-50 cursor-auto"
                        )}
                        onClick={() => {
                            {/* 폼이 처리 중인 경우 클릭 무시 */}
                            if (pending) return;
                            {/* 이미지 선택 시 id 설정 */}
                            setSelectedImageId(image.id);
                        }}
                    >
                        {/* 사용자가 이미지 선택 시 해당 이미지 정보가 아래 라디오 버튼 value에 다 들어간다 -> 추후 서버에서 split("|")해서 사용 */}
                        <input 
                            type="radio"
                            id={id}
                            name={id}
                            className="hidden"
                            checked={selectedImageId === image.id}
                            disabled={pending}
                            value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                        />
                        <Image
                            src={image.urls.thumb} 
                            alt="unsplash image"
                            className="object-cover rounded-sm"
                            fill
                        />
                        {/* 이미지 클릭 시 체크 표시 */}
                        {selectedImageId === image.id && (
                            <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                        )}
                        <Link 
                            href={image.links.html}
                            target="_blank"
                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                        >
                            {image.user.name}
                        </Link>
                    </div>
                ))}
            </div>
            <FormErrors 
                id="image"
                errors={errors}
            />
        </div>
    )
}