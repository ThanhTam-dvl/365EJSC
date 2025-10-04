import { useState } from "react";

export default function ReplyForm({ onReply }) {
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(replyText);
    setReplyText("");
  };

  return (
    <div className="mt-2 flex">
      <input
        className="border flex-1 p-1 rounded-l text-sm"
        placeholder="Reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <button
        onClick={handleReply}
        className="bg-blue-400 text-white px-2 rounded-r text-sm"
      >
        Reply
      </button>
    </div>
  );
}
