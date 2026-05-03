// src/pages/AdminPage.jsx
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../lib/api";

const AdminPage = () => {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="card bg-base-200 p-4">
        {users.map((user) => (
          <div key={user._id} className="flex justify-between border-b py-2">
            <span>{user.fullName}</span>
            <span className="badge">{user.role}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminPage;