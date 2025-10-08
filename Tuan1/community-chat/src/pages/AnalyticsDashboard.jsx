import { useQuery } from '@tanstack/react-query';
import { getStats, getMessages } from '../services/api';
import AdminLayout from '../components/admin/AdminLayout';

export default function AnalyticsDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: 30000,
  });

  const { data: messagesData } = useQuery({
    queryKey: ['messages'],
    queryFn: getMessages,
    select: (data) => data.data,
  });

  if (statsLoading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Đang tải thống kê...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics Dashboard">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Stats Cards */}
        <div className="bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">Tổng tin nhắn</h3>
          <p className="text-2xl font-bold text-blue-400">{stats?.totalMessages || 0}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">Tổng replies</h3>
          <p className="text-2xl font-bold text-green-400">{stats?.totalReplies || 0}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">Người dùng active</h3>
          <p className="text-2xl font-bold text-purple-400">{stats?.activeUsers || 0}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">Tin nhắn mới nhất</h3>
          <p className="text-xs text-gray-400">
            {stats?.latestMessage ? new Date(stats.latestMessage).toLocaleString('vi-VN') : 'Chưa có'}
          </p>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Top Active Users</h3>
        <div className="space-y-2">
          {messagesData && Object.entries(
            messagesData.reduce((acc, msg) => {
              acc[msg.username] = (acc[msg.username] || 0) + 1;
              return acc;
            }, {})
          )
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([username, count], index) => (
              <div key={username} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-gray-700 rounded-lg bg-gray-750 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-bold text-blue-400">#{index + 1}</span>
                  <span className="font-semibold text-white">{username}</span>
                </div>
                <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm sm:ml-auto">
                  {count} tin nhắn
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </AdminLayout>
  );
}