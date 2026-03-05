import TopNavigation from "@/components/customer-ui/new-navigation-menu";
import { colors } from "@/lib/colors";

export default function CustomerLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const items = [
        { label: "Home", link: "/customer" },
        { label: "Orders", link: "/customer/orders", subItems: [
            {label: "Cart", link: "/customer/orders/cart"},
            {label: "History", link: "/customer/orders/history"}
        ] },        
        {
            label: "Support",
            link: "/customer/support",
            subItems: [
                { label: "Contact Us", link: "/customer/support/contact" },
                { label: "FAQ", link: "/customer/support/faq" },
                { label: "Complaint", link: "/customer/support/complaint" },
            ]
        },
    ];

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: colors.background.app }}>
            <div className="justify-center w-full shadow-md" style={{ backgroundColor: colors.background.card }}>
                <TopNavigation items={items}/>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
