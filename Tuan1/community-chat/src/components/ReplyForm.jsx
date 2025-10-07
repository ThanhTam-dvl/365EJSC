import { useForm } from 'react-hook-form';

export default function ReplyForm({ onReply }) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm();

  const onSubmit = (data) => {
    onReply(data.replyText);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col space-y-2">
      <div className="flex space-x-2">
        <div className="flex-1">
          <input
            className="w-full border flex-1 p-2 rounded-l text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Reply..."
            {...register("replyText", {
              required: "Reply không được để trống",
              minLength: {
                value: 1,
                message: "Reply phải có ít nhất 1 ký tự"
              }
            })}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-400 text-white px-3 rounded-r text-sm disabled:bg-blue-200"
        >
          {isSubmitting ? "..." : "Reply"}
        </button>
      </div>
      {errors.replyText && (
        <p className="text-red-500 text-xs">{errors.replyText.message}</p>
      )}
    </form>
  );
}