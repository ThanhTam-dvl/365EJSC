import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold mb-4">404 - Không tìm thấy trang</h2>
      <p className="text-muted mb-6">Trang bạn truy cập không tồn tại hoặc đã bị xóa.</p>
      <Link to="/" className="px-4 py-2 bg-primary text-white rounded">Về Trang chủ</Link>
    </div>
  );
}
