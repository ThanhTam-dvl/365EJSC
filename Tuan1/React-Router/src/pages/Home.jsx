import { useState } from 'react';

export function HomePage() {
    const [count, setCount] = useState(0); 
    
  return (
    <div>
        <h2>Home Page</h2>
        <p>You did click {count} times</p>
        <button onClick={() => setCount(c => c+1)}>Click me</button>
    </div>
  );
}
