import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function Join() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  
  const navigate = useNavigate();

  const onSubmit = (data) => {
    localStorage.setItem("username", data.username);
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-blue-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Join TaZi Community Chat</h2>
          <p className="text-blue-600">Nhập tên hay biệt danh của bro để bắt đầu chat với mọi người.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              className="w-full border border-blue-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="Nhập tên bro..."
              {...register("username", {
                required: "Tên là bắt buộc",
                minLength: {
                  value: 2,
                  message: "Tên phải có ít nhất 2 ký tự"
                },
                maxLength: {
                  value: 20,
                  message: "Tên không được quá 20 ký tự"
                },
                pattern: {
                  value: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                  message: "Tên chỉ được chứa chữ cái, số và dấu gạch dưới"
                }
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            {isSubmitting ? "Đang tham gia..." : "Tham gia Chat"}
          </button>
        </form>
      </div>
    </div>
  );
}