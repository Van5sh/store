import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
    const data = [
        {
            id: 1,
            name: "Aditya Mishra",
            email: "aditya@gmail.com",
            phone: "9876543210",
            role: "Student",
        },
        {
            id: 2,
            name: "Rahul Sharma",
            email: "rahul@gmail.com",
            phone: "9123456780",
            role: "Admin",
        },
        {
            id: 3,
            name: "Sneha Patel",
            email: "sneha@gmail.com",
            phone: "9988776655",
            role: "User",
        },
    ];

    // Extract column names dynamically (ignore id if you want)
    const columns = Object.keys(data[0]).filter((key) => key !== "id");
    const columnLabels: Record<string, string> = {
        name: "Name",
        email: "Email",
        phone: "Phone",
        role: "Role",
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

export default Dashboard;
