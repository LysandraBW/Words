'use client';
import { useEffect, useState } from "react"
import { books } from "../login/books";
import clsx from "clsx";

export default function Page() {
    const [images, setImages] = useState(books);

    useEffect(() => {
        console.log(JSON.stringify(images));
    }, [images]);

    const shiftImage = (i0: number, i1: number) => {
        const updatedImages = [...images];
        const [image] = updatedImages.splice(i0, 1);
        updatedImages.splice(i1, 0, image);
        setImages(updatedImages);
    }

    return (
        <div className="flex flex-wrap gap-6 p-6 h-screen overflow-y-auto">
            {images.map((image, i) => (
                <div key={image.title} className="border border-white p-1">
                    <p className="text-white font-medium">
                        Image {i}
                    </p>
                    <input
                        type="number"
                        onBlur={(event: any) => shiftImage(i, Number(event.target.value))}
                        className="bg-neutral-800"
                    />
                    <div
                        className={clsx(
                            "w-[100px] h-[200px] bg-contain bg-no-repeat",
                            image.background
                        )}
                    />
                </div>
            ))}
        </div>
    )
}