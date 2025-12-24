import TopNavigation from "@/components/customer-ui/navigation-menu";

export default function CustomerLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const items = [
        { label: "Home", link: "/customer" },
        { label: "Services", link: "/customer/services" },
        { label: "Orders", link: "/customer/orders" },
        {
            label: "Profile",
            link: "/customer/profile",
            subItems: [
                { label: "Settings", link: "/customer/profile/settings" },
                { label: "Billing", link: "/customer/profile/billing" },
                { label: "Notifications", link: "/customer/profile/notifications" }
            ]
        },
        {
            label: "Support",
            link: "/customer/support",
            subItems: [
                { label: "Contact Us", link: "/customer/support/contact" },
                { label: "FAQ", link: "/customer/support/faq" },
                { label: "Complaint", link: "/customer/support/complaint" }
            ]
        },
    ];

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <TopNavigation items={items}/>
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}