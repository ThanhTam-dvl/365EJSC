import React, { useReducer } from "react";

/*
  - Dùng useReducer khi state phức tạp / nhiều hành động.
*/
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "reset":
      return { ...state, count: 0 };
    case "set":
      return { ...state, count: action.payload };
    default:
      return state;
  }
}

export default function ReducerDemo() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h2>useReducer — Counter (nhiều action)</h2>
      <p>Count: <strong>{state.count}</strong></p>
      <div>
        <button onClick={() => dispatch({ type: "increment" })}>+</button>{" "}
        <button onClick={() => dispatch({ type: "decrement" })}>-</button>{" "}
        <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <input type="number" placeholder="Set value" onChange={e => dispatch({ type: "set", payload: Number(e.target.value) })} />
      </div>
      <small className="note">useReducer giúp quản lý logic phức tạp rõ ràng hơn.</small>
    </div>
  );
}
