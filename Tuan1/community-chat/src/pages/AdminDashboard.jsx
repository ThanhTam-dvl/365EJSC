import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    const mockUsers = [
      { id: 1, username: 'tam', email: 'tam@email.com', role: 'user', createdAt: '2024-10-01' },
      { id: 2, username: 'minh', email: 'minh@email.com', role: 'user', createdAt: '2024-10-02' },
      { id: 3, username: 'linh', email: 'linh@email.com', role: 'user', createdAt: '2024-10-03' },
    ];
    setUsers(mockUsers);
  }, []);

  const onSubmit = (data) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...data }
          : user
      ));
    } else {
      const newUser = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    reset();
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setValue('username', user.username);
    setValue('email', user.email);
    setValue('role', user.role);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    reset();
  };

  return (
    <AdminLayout title="User Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add/Edit User Form */}
        <div className="lg:col-span-1">

          <div className="mb-4 bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-700">
            <h3 className='text-red-600'><strong>Lưu ý: </strong>Dữ liệu ở trang Dashboard này chỉ là giả lập để test chức năng, chưa kết nối API thật.</h3>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingUser ? 'Chỉnh sửa User' : 'Thêm User Mới'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  {...register("username", {
                    required: "Username là bắt buộc",
                    minLength: {
                      value: 3,
                      message: "Username phải có ít nhất 3 ký tự"
                    }
                  })}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email không hợp lệ"
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("role", { required: "Role là bắt buộc" })}
                >
                  <option value="">Chọn role</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-colors"
                >
                  {editingUser ? 'Cập nhật' : 'Thêm User'}
                </button>
                
                {editingUser && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>


        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-xl font-bold text-white">Danh sách Users</h3>
              <span className="text-gray-400 bg-gray-700 px-3 py-1 rounded-full text-sm">
                {users.length} users
              </span>
            </div>
            
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-700 rounded-lg bg-gray-750 gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{user.username}</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                      user.role === 'admin' ? 'bg-red-900 text-red-200' :
                      user.role === 'moderator' ? 'bg-blue-900 text-blue-200' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}