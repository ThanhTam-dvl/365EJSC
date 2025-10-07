import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // Mock users data (trong thực tế sẽ call API thâtj)
  useEffect(() => {
    const mockUsers = [
      { id: 1, username: 'tam', email: 'tam@gmail.com', role: 'user', createdAt: '2024-10-01' },
      { id: 2, username: 'sieunhan', email: 'sieunhan@gmail.com', role: 'user', createdAt: '2024-10-02' },
      { id: 3, username: 'tamzit', email: 'tamzit@gmail.com', role: 'user', createdAt: '2024-10-03' },
    ];
    setUsers(mockUsers);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  const onSubmit = (data) => {
    if (editingUser) {
      // Update user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...data }
          : user
      ));
    } else {
      // Add new user
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-14">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                Admin Dashboard
              </h2>
              <p className="text-blue-600">
                Quản lý: {users.length} users
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                {editingUser ? 'Chỉnh sửa User' : 'Thêm User Mới'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full border border-blue-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("username", {
                      required: "Username là bắt buộc",
                      minLength: {
                        value: 3,
                        message: "Username phải có ít nhất 3 ký tự"
                      }
                    })}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-blue-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("email", {
                      required: "Email là bắt buộc",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email không hợp lệ"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <select
                    className="w-full border border-blue-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...register("role", { required: "Role là bắt buộc" })}
                  >
                    <option value="">Chọn role</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
                  >
                    {editingUser ? 'Cập nhật' : 'Thêm User'}
                  </button>
                  
                  {editingUser && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl"
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
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Danh sách Users</h3>
              
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-4 border border-blue-100 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-800">{user.username} <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {user.role}
                      </span></h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
      </div>
        <div className="bg-blue-50 rounded-xl m-4 p-4 border border-blue-100">
            <p className="text-blue-800 mb-1 text-x text-center">
                <strong>Lưu ý:</strong> Dữ liệu chỉ giả lập để test chức năng, chưa kết nối API thật.
            </p>
              
        </div>
    </div>
  );
}