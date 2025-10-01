import React, { useState } from "react";

export default function CounterUseState() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  return (
    <div>
      <h2>useState — Counter</h2>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(c => c + 1)}>Tăng</button>{" "}
      <button onClick={() => setCount(c => c - 1)}>Giảm</button>{" "}
      <button onClick={() => setCount(0)}>Reset</button>

      <hr />

      <h3>Controlled input</h3>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Gõ tên..." />
      <p>Xin chào: <strong>{name || "<chưa nhập>"}</strong></p>
    </div>
  );
}
