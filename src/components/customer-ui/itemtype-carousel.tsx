
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselProps {
    Items: {
        label: string;
        img: string;
    }[]
}

const CarouselSize: React.FC<CarouselProps> = ({ Items }) => {
    return (
        <Carousel
            opts={{ align: "start" }}
            className="w-full"
        >
            <CarouselContent className="-ml-2">
                {Items.map((item, index) => (
                    <CarouselItem
                        key={index}
                        className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">{item.img}</div>
                                    <span className="text-lg font-semibold text-gray-700">
                                        {item.label}
                                    </span>
                                </div>
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

export default CarouselSize;