import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, createMessage } from "../services/api";
import MessageCard from "../components/MessageCard";
import { useForm } from "react-hook-form";
import { useNotifications } from '../stores/notification.store';
import { useAuth } from '../stores/auth.store';

export default function Chat() {
  const username = localStorage.getItem("username");
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotifications();
  const { currentUser } = useAuth();

  // Sử dụng useQuery để fetch messages - Auto refetch mỗi 5s
  const { 
    data: messages = [], 
    isLoading, 
    error,
    isFetching 
  } = useQuery({
    queryKey: ['messages'],
    queryFn: getMessages,
    select: (data) => data.data, 
    refetchInterval: 5000, // Auto refetch mỗi 5s
  });

  // Sử dụng useMutation để tạo message 
  const { 
    mutate: sendMessage, 
    isLoading: isSending,
    error: sendError 
  } = useMutation({
    mutationFn: createMessage,
    onMutate: async (newMessage) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages'] });
      
      const previousMessages = queryClient.getQueryData(['messages']);
      
      // update với ID tạm
      const optimisticMessage = {
        id: Date.now(), // ID tạm
        ...newMessage,
        createdAt: new Date().toISOString(),
        replies: []
      };
      
      queryClient.setQueryData(['messages'], (old) => ({
        data: [optimisticMessage, ...(old?.data || [])]
      }));
      
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      queryClient.setQueryData(['messages'], context.previousMessages);
      notifyError('Gửi tin nhắn thất bại');
    },
    onSuccess: () => {
      success('Tin nhắn đã được gửi');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    watch 
  } = useForm({
    mode: "onChange"
  });

  const messageText = watch("message", "");

  const onSubmit = async (data) => {
    sendMessage({
      username, 
      message: data.message, 
      replies: [],
      avatar: currentUser?.avatar || '' ,
      avatarUrl: currentUser?.avatarUrl || '',
    });
    reset();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 pt-14 pb-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-600 dark:text-blue-400">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 pt-14 pb-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Lỗi tải tin nhắn: {error.message}</p>
          <button 
            onClick={() => queryClient.refetchQueries({ queryKey: ['messages'] })}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 pt-14 pb-32 transition-colors duration-200">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6 border border-blue-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                Chào mừng, <span className="text-blue-600 dark:text-blue-400">{username}</span>
              </h2>
              <p className="text-blue-600 dark:text-blue-400">
                {isFetching ? 'Đang đồng bộ...' : 'Bạn là một phần của community chat!'}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length} tin nhắn
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center border border-blue-200 dark:border-gray-700">
              <p className="text-blue-600 dark:text-blue-400 text-lg">Không có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} />
            ))
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-blue-200 dark:border-gray-700 p-4 shadow-lg transition-colors duration-200">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-1">
              <input
                className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Nhập tin nhắn..."
                {...register("message", {
                  required: "Tin nhắn không được để trống",
                  minLength: {
                    value: 1,
                    message: "Tin nhắn phải có ít nhất 1 ký tự"
                  },
                  maxLength: {
                    value: 1000,
                    message: "Tin nhắn không được quá 1000 ký tự"
                  }
                })}
              />
              {errors.message && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">{errors.message.message}</p>
              )}
              {sendError && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 ml-1">Gửi tin nhắn thất bại</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-200 disabled:to-blue-300 text-white font-semibold px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:shadow-none"
            >
              {isSending ? "..." : "Gửi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}