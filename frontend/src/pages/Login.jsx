import { useState, useContext } from "react";
import { loginUser } from "../services/api.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending login request with:", { email, password }); // Debug log

        try {
            const response = await loginUser({ email, password });
            console.log("Login successful:", response.data);
            navigate("/dashboard")
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            alert(error.response ? error.response.data.message : "Login error");
        }
    };


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
