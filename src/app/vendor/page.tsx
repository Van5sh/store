"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse, BaggageClaim, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  getRecentActivity,
  RecentActivityItem,
} from "@/app/actions/activity/get-recent-activity";

const VendorPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const displayName = user?.name ?? user?.userName ?? "Vendor";
  const displayUserName = user?.userName ?? user?.name ?? "N/A";
  const displayEmail = user?.email ?? "N/A";
  const displayRole = user?.role ?? "vendor";

  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getRecentActivity({
          limit: 10,
        });

        setActivities(response.activities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, []);

  const services = [
    {
      name: "Product Management",
      description:
        "Manage your product listings, inventory, and pricing with ease.",
      icon: BaggageClaim,
      route: "/vendor/products",
    },
    {
      name: "Warehouse Management",
      description:
        "Keep track of your stock levels and manage your warehouse efficiently.",
      icon: Warehouse,
      route: "/vendor/warehouses",
    },
    {
      name: "Store Management",
      description:
        "View and manage your store and product listings.",
      icon: Store,
      route: "/vendor/store",
    },
  ];

  return (
    <>
      <div>
        <div className="text-lg font-semibold">
          Vendor Dashboard
        </div>

        <div className="text-sm text-[#5B6770] dark:text-[#D8DEE5] mt-2">
          Overview of today’s performance and activity.
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <section>
          <Card className="border-[#D8DEE5] bg-[#F5F7FA] text-[#203A43] dark:border-[#254757] dark:bg-[#203A43] dark:text-[#F5F7FA]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {displayName}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#5B6770] dark:text-[#D8DEE5]">
                  Username
                </span>
                <span className="font-medium">
                  {displayUserName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B6770] dark:text-[#D8DEE5]">
                  Email
                </span>
                <span className="font-medium">
                  {displayEmail}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B6770] dark:text-[#D8DEE5]">
                  Role
                </span>
                <span className="font-medium">
                  {displayRole}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-5 mt-6">
            {services.map((service) => (
              <Card
                key={service.name}
                onClick={() => router.push(service.route)}
                className="hover:cursor-pointer hover:shadow-md hover:bg-[#E2E8F0] hover:-translate-y-2 transition-transform border-[#D8DEE5] dark:border-[#254757] dark:bg-[#203A43]"
              >
                <CardHeader>
                  <CardTitle className="text-xl">
                    {service.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <service.icon size={60} />

                    <p className="text-center text-[#5B6770] dark:text-[#D8DEE5]">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside className="rounded-lg border border-[#D8DEE5] bg-[#F5F7FA] p-4 shadow-sm dark:border-[#254757] dark:bg-[#203A43]">
          <h2 className="text-sm font-semibold">
            Recent Activity
          </h2>

          <div className="mt-4 space-y-3">
            {loadingActivities ? (
              <p className="text-sm text-[#5B6770] dark:text-[#D8DEE5]">
                Loading activities...
              </p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-[#5B6770] dark:text-[#D8DEE5]">
                No recent activity found.
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-b border-[#D8DEE5] pb-3 last:border-none dark:border-[#254757]"
                >
                  <p className="font-medium text-sm">
                    {activity.message}
                  </p>

                  <p className="text-xs text-[#5B6770] dark:text-[#D8DEE5] mt-1">
                    {activity.user?.name
                      ? `${activity.user.name} • `
                      : ""}
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default VendorPage;