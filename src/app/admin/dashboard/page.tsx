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

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        {columns.map((column) => (
                            <th
                                key={column}
                                className="border border-gray-300 p-3 text-left capitalize"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-100">
                            {columns.map((column) => (
                                <td
                                    key={column}
                                    className="border border-gray-300 p-2"
                                >
                                    {row[column]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;

