import { useEffect, useState } from "react";
import {
  getUsers,
  approveUser,
  lockUser,
  increaseBalance,
} from "../../services/adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    await approveUser(id);
    fetchUsers();
  };

  const handleLock = async (id) => {
    await lockUser(id);
    fetchUsers();
  };

  const handleAddBalance = async (id) => {
    if (!amount || amount <= 0) return alert("Enter valid amount");

    await increaseBalance(id, amount);
    setAmount("");
    fetchUsers();
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>Users</h2>

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Active</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>{u.isActive ? "Yes" : "No"}</td>
              <td>${u.balance}</td>

              <td>
                {u.status !== "approved" && (
                  <button onClick={() => handleApprove(u._id)}>
                    Approve
                  </button>
                )}

                {u.isActive && (
                  <button onClick={() => handleLock(u._id)}>
                    Lock
                  </button>
                )}

                <div style={{ marginTop: 6 }}>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ width: 80 }}
                  />
                  <button onClick={() => handleAddBalance(u._id)}>
                    Add Balance
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
