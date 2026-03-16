import { useState, useEffect } from "react";
import { getUsers, updateUserRole, deleteUser } from "../../services/api";
import { FiUser, FiTrash2, FiShield, FiSearch, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(
                users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
            );
            toast.success("Role updated");
        } catch (err) {
            toast.error("Failed to update role");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter((u) => u._id !== userId));
            toast.success("User deleted");
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    const roleBadge = (role) => {
        const styles = {
            admin: "bg-red-50 text-red-600 border-red-100",
            faculty: "bg-amber-50 text-amber-600 border-amber-100",
            student: "bg-amber-50 text-amber-600 border-amber-100",
        };
        return `px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${styles[role]}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    User Management
                </span>
            </h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all shadow-sm focus:shadow-md"
                    />
                </div>
                <div className="relative min-w-[180px]">
                    <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold focus:outline-none focus:border-amber-500 appearance-none cursor-pointer shadow-sm hover:shadow-md transition-all"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="student">Student</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">
                        ▼
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Identity
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">
                                    Contact Email
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                                    Access Level
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                                    Management
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users
                                .filter((user) => {
                                    const matchesSearch =
                                        user.name.toLowerCase().includes(search.toLowerCase()) ||
                                        user.email.toLowerCase().includes(search.toLowerCase());
                                    const matchesRole =
                                        roleFilter === "all" || user.role === roleFilter;
                                    return matchesSearch && matchesRole;
                                })
                                .map((user) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0 shadow-lg font-bold text-white text-xs">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-bold text-slate-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500 hidden md:table-cell">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={roleBadge(user.role)}>{user.role}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="relative">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) =>
                                                            handleRoleChange(user._id, e.target.value)
                                                        }
                                                        className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="faculty">Faculty</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-400">
                                                        ▼
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                                    title="Delete User"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default ManageUsers;

