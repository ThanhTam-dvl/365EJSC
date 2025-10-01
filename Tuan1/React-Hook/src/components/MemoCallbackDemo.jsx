import React, { useState, useMemo, useCallback } from "react";

/*
  - useMemo: tránh tính toán nặng mỗi lần render nếu dependency không đổi.
  - useCallback: tránh tạo lại hàm khi không cần.
  - React.memo: prevent child re-render nếu props không đổi.
*/

const Child = React.memo(function Child({ value, onInc }) {
  console.log("Child render");
  return (
    <div>
      <p>Expensive value: <strong>{value}</strong></p>
      <button onClick={onInc}>Tăng count (từ child)</button>
    </div>
  );
});

function heavyCompute(n) {
  // mô phỏng tác vụ nặng
  let total = 0;
  for (let i = 0; i < 6_000_000; i++) {
    total += i % (n + 1);
  }
  return total;
}

export default function MemoCallbackDemo() {
  const [count, setCount] = useState(1);
  const [other, setOther] = useState(false);

  const expensive = useMemo(() => {
    console.log("Computing expensive value...");
    return heavyCompute(count);
  }, [count]);

  const handleInc = useCallback(() => setCount(c => c + 1), []);
  // handleInc ổn định (không thay đổi) => child nhận cùng ref hàm

  return (
    <div>
      <h2>useMemo + useCallback + React.memo</h2>
      <p>Count (dependency): <strong>{count}</strong></p>
      <button onClick={() => setOther(o => !o)}>Toggle other state (không liên quan)</button>
      <Child value={expensive} onInc={handleInc} />
      <small className="note">Mở console để thấy khi nào compute chạy và khi nào Child re-render.</small>
    </div>
  );
}
