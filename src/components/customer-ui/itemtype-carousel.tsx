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
import { useRouter } from "next/navigation";
import { colors } from "@/lib/colors";

interface CarouselProps {
  Items: {
    label: string;
    img: string;
    type: string;
  }[];
}

const CarouselSize: React.FC<CarouselProps> = ({ Items }) => {
  const router = useRouter();
  const path = (type: string) => `/customer/products/${type}`;

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent className="-ml-2 flex gap-4">
        {Items.map((item, index) => (
          <CarouselItem
            key={index}
            className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <Card className="hover:shadow-lg transition-shadow" 
              style={{ borderColor: colors.border.light }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.border.accent;
                e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.amber[200]}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border.light;
                e.currentTarget.style.boxShadow = '';
              }}>
              <CardContent
                className="flex aspect-square items-center justify-center p-6 cursor-pointer"
                onClick={() => router.push(path(item.type))}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{item.img}</div>
                  <span className="text-lg font-semibold" style={{ color: colors.text.secondary }}>
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
  );
};

export default CarouselSize;