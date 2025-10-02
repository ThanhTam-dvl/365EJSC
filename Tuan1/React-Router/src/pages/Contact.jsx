import { useNavigate } from "react-router-dom";
export function Contact() {
    const navigate = useNavigate();
    
    return (
        <div>
            <h2>Contact page</h2>
            <button onClick={() => navigate('/')}> Return Home</button>
        </div>
    );
}
