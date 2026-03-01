import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const OrdersPage = () => {
    type OrderRow = {
        id: number;
        orderID: string;
        customerID: string;
        date: string;
    };

    const data: OrderRow[] = [
        {
            id: 1,
            orderID: "ORD-1042",
            customerID: "CUST-2031",
            date: "2026-02-18",
        },
        {
            id: 2,
            orderID: "ORD-1041",
            customerID: "CUST-2024",
            date: "2026-02-17",
        },
        {
            id: 3,
            orderID: "ORD-1040",
            customerID: "CUST-2019",
            date: "2026-02-16",
        },
    ];

    // Extract column names dynamically (ignore id if you want)
    const columns = (Object.keys(data[0]) as Array<keyof OrderRow>).filter(
        (key) => key !== "id"
    );
    const columnLabels: Partial<Record<keyof OrderRow, string>> = {
        orderID: "Order ID",
        customerID: "Customer ID",
        date: "Date",
    };

    return (
        <Table className="min-w-full border border-gray-300 text-sm">
            <TableHeader>
                <TableRow className="bg-gray-200">
                    {columns.map((column) => (
                        <TableHead
                            key={column}
                            className="border border-gray-300 p-3 text-left capitalize"
                        >
                            {columnLabels[column] ?? column}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                        {columns.map((column) => (
                            <TableCell
                                key={column}
                                className="border border-gray-300 p-2"
                            >
                                {row[column]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default OrdersPage;
