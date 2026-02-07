const Dashboard=()=>{
    return (
        <div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border border-gray-300 p-2">{user.name}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2">{user.phone}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
            <p>Hello</p>
        </div>
    );
}

export default Dashboard;