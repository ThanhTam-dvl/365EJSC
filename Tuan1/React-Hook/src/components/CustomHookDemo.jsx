import React from "react";
import useWindowWidth from "../hooks/useWindowWidth";

export default function CustomHookDemo() {
  const width = useWindowWidth();

  return (
    <div>
      <h2>Custom Hook — useWindowWidth</h2>
      <p>Chiều rộng cửa sổ: <strong>{width}px</strong></p>
      <small className="note">Resize cửa sổ để thấy giá trị thay đổi.</small>
    </div>
  );
}
