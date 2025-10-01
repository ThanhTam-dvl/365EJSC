import React, { createContext, useContext, useState } from "react";


const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeStatus() {
  const { theme, toggle } = useContext(ThemeContext);
  const style = {
    padding: 12,
    background: theme === "light" ? "#f3f4f6" : "#111827",
    color: theme === "light" ? "#111827" : "#e5e7eb",
    borderRadius: 8
  };
  return (
    <div style={style}>
      <p>Theme hiện tại: <strong>{theme}</strong></p>
      <button onClick={toggle}>Chuyển theme</button>
    </div>
  );
}

export default function ContextDemo() {
  return (
    <div>
      <h2>useContext — Theme demo</h2>
      <ThemeProvider>
        <ThemeStatus />
      </ThemeProvider>
    </div>
  );
}
