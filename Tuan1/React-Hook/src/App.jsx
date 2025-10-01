import React, { useState } from "react";
import CounterUseState from "./components/CounterUseState.jsx";
import EffectFetch from "./components/EffectFetch.jsx";
import ContextDemo from "./components/ContextDemo.jsx";
import RefDemo from "./components/RefDemo.jsx";
import ReducerDemo from "./components/ReducerDemo.jsx";
import MemoCallbackDemo from "./components/MemoCallbackDemo.jsx";
import CustomHookDemo from "./components/CustomHookDemo.jsx";

const demos = [
  { id: "useState", label: "useState" },
  { id: "useEffect", label: "useEffect" },
  { id: "useContext", label: "useContext" },
  { id: "useRef", label: "useRef" },
  { id: "useReducer", label: "useReducer" },
  { id: "useMemoCallback", label: "useMemo + useCallback" },
  { id: "customHook", label: "Custom Hook (useWindowWidth)" },
];

export default function App() {
  const [active, setActive] = useState("useState");

  const renderDemo = () => {
    switch (active) {
      case "useState":
        return <CounterUseState />;
      case "useEffect":
        return <EffectFetch />;
      case "useContext":
        return <ContextDemo />;
      case "useRef":
        return <RefDemo />;
      case "useReducer":
        return <ReducerDemo />;
      case "useMemoCallback":
        return <MemoCallbackDemo />;
      case "customHook":
        return <CustomHookDemo />;
      default:
        return <div>Chọn demo ở cột trái</div>;
    }
  };

  return (
    <div>
      <header className="app-header">
        <h1 style={{margin:0}}>React Hooks Demo - Nguyễn Thành Tâm</h1>
      </header>
      <div className="container">
        <nav className="nav">
          {demos.map(d => (
            <button
              key={d.id}
              className={active === d.id ? "active" : ""}
              onClick={() => setActive(d.id)}
            >
              {d.label}
            </button>
          ))}
          <hr />
          <small className="note">Mỗi demo minh hoạ 1 hook và comment giải thích.</small>
        </nav>

        <main className="main">
          <div className="card">{renderDemo()}</div>
        </main>
      </div>
    </div>
  );
}
