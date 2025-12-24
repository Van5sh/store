import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselSize() {
    return (
        <Carousel
            opts={{ align: "start" }}
            className="w-full overflow-visible"
        >
            <CarouselContent className="-ml-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <CarouselItem
                        key={index}
                        className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                    >
                        <Card className="hover:shadow-lg transition">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-3xl font-bold text-gray-700">
                                    {index + 1}
                                </span>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
