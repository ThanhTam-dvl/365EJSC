// About.jsx (updated with research tasks and footer)
export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-4 mt-14 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-blue-200 dark:border-gray-700 mb-6">
          <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-6 text-center">
            About TaZi Community Chat
          </h2>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              TaZi Community Chat là ứng dụng web mini xây dựng bằng React + Vite + TailwindCSS. 
              Người dùng có thể trò chuyện, trả lời, chỉnh sửa, xóa tin nhắn và giả lập real-time với MockAPI.
            </p>
            
            <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 border border-blue-100 dark:border-gray-600">
              <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-3 text-xl text-center">Tính năng chính</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Trò chuyện cộng đồng thời gian thực</li>
                <li>Trả lời tin nhắn (Reply)</li>
                <li>Chỉnh sửa và xóa tin nhắn của chính mình</li>
                <li>Giao diện responsive cho mobile & desktop</li>
                <li>Không cần tài khoản - chỉ cần tên (Guest Mode)</li>
                <li>Đăng ký tài khoản để bảo vệ danh tính</li>
                <li>Giao diện admin với layout riêng</li>
                <li>Quản lý tài khoản users và các thống kê tổng quan</li>
                <li>Dark/Light theme toggle</li>
                <li>Upload avatar hoặc sử dụng URL avatar</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-gray-700 rounded-xl p-4 border border-green-100 dark:border-gray-600">
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-3 text-xl text-center">Công nghệ sử dụng</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>React.js với Hooks</li>
                <li>TailwindCSS cho styling</li>
                <li>React Router DOM cho navigation</li>
                <li>Axios cho API calls</li>
                <li>MockAPI cho backend</li>
                <li>React Hook Form</li>
                <li>TanStack Query</li>
                <li>Zustand cho state management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-blue-200 dark:border-gray-700 text-center">
          <div className="text-gray-600 dark:text-gray-400">
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              © 2025 Nguyễn Thành Tâm
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              TaZi Community Chat - Mini Project tổng kết 2 tuần nghiên cứu React thực tập ở Công Ty 365EJSC 
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}