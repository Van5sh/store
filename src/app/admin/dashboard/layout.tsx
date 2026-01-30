"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export default function DashboardLayout({
  orderDetails,
  warehouseDetails,
  children,
}: {
  orderDetails?: React.ReactNode;
  warehouseDetails?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Tabs defaultValue="users" className="flex-1 flex flex-col justify-center items-center">
        <TabsList className="mx-4 mt-4 self-start">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="users">
            {children ?? <div>No users content</div>}
          </TabsContent>

          <TabsContent value="orders">
            {orderDetails ?? <div>No orders content</div>}
          </TabsContent>

          <TabsContent value="warehouse">
            {warehouseDetails ?? <div>No warehouse content</div>}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
