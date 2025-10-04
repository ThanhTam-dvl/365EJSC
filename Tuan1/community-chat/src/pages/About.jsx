export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 mt-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-blue-200">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">About Community Chat</h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Community Chat là ứng dụng web mini xây dựng bằng React + Vite + TailwindCSS. 
              Người dùng có thể trò chuyện, trả lời, chỉnh sửa, xóa tin nhắn và giả lập real-time với MockAPI.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-3 text-xl text-center">Tính năng chính</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Trò chuyện cộng đồng thời gian thực</li>
                <li>Trả lời tin nhắn (Reply)</li>
                <li>Chỉnh sửa và xóa tin nhắn của chính mình</li>
                <li>Giao diện responsive cho mobile & desktop</li>
                <li>Không cần tài khoản - chỉ cần tên</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-bold text-green-800 mb-3 text-xl text-center">Công nghệ sử dụng</h3>
              <ul className="space-y-2">
                <li>• React.js với Hooks</li>
                <li>• TailwindCSS cho styling</li>
                <li>• React Router DOM cho navigation</li>
                <li>• Axios cho API calls</li>
                <li>• MockAPI cho backend</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}