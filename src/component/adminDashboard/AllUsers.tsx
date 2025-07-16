import React from "react";
import {
  useGetAllUsersProfilesQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} from "../../features/api/userApi";
import { Loader2, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const AllUsers: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersProfilesQuery(undefined, { skip: !token });

  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [deleteUserProfile] = useDeleteUserProfileMutation();

  const handleToggleRole = async (userId: number, currentRole: string) => {
    if (!userId) return Swal.fire("Error", "Missing user ID", "error");
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      await updateUserProfile({ user_id: userId, role: newRole }).unwrap();
      Swal.fire("Role Updated", `User is now a ${newRole}`, "success");
      refetch();
    } catch {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!userId) return Swal.fire("Error", "Missing user ID", "error");

    const result = await Swal.fire({
      title: "Delete user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteUserProfile(userId).unwrap();
        Swal.fire("Deleted", "User removed successfully", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
          <ShieldCheck size={20} /> All Users
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4">
          <p className="font-semibold">We're having trouble loading users right now.</p>
          <p className="text-sm text-gray-600 mt-1">
            The server may be temporarily unavailable or under maintenance.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 btn btn-sm btn-outline text-green-600 hover:bg-green-100"
          >
            Retry
          </button>
        </div>
      ) : (
        <table className="w-full text-sm text-left table-auto border">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => {
              const userId = user.userId;

              return (
                <tr key={userId} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-gray-900 font-semibold">{user.firstname} {user.lastname}</td>
                  <td className="p-2 text-green-800 font-medium">{user.email}</td>
                  <td className="p-2  text-slate-800">{user.contactPhone}</td>
                  <td className="p-2 text-indigo-700 font-bold">{user.address}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${user.role === "admin" ? "bg-blue-600" : "bg-gray-600"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      className="btn btn-sm bg-yellow-500 text-white"
                      onClick={() => handleToggleRole(userId, user.role)}
                    >
                      Toggle Role
                    </button>
                    <button
                      className="btn btn-sm bg-red-600 text-white"
                      onClick={() => handleDeleteUser(userId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllUsers;
