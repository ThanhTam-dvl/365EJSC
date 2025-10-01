import React, { useRef, useState, useEffect } from "react";

/*
  - ref tới input DOM để focus.
  - dùng ref để lưu giá trị trước đó.
*/
export default function RefDemo() {
  const inputRef = useRef(null);
  const prevValRef = useRef("");
  const [value, setValue] = useState("");

  useEffect(() => {
    prevValRef.current = value; // cập nhật prev sau mỗi render
  }, [value]);

  return (
    <div>
      <h2>useRef — DOM & persist value</h2>
      <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} placeholder="Gõ gì đó..." />
      <div style={{marginTop:8}}>
        <button onClick={() => inputRef.current && inputRef.current.focus()}>Focus input</button>
        <button onClick={() => { if (inputRef.current) inputRef.current.value = "set trực tiếp (DOM)"; }}>Set DOM value (không thay state)</button>
      </div>
      <p>Current: <strong>{value}</strong></p>
      <p>Previous (lưu bằng ref): <strong>{prevValRef.current}</strong></p>
      <small className="note">ref không làm component re-render khi thay đổi.</small>
    </div>
  );
}
