import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import API_URL from "../config";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("data&&&&&&&&&&");

      console.log(data);
      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("teacherid", data.teacherid || "");
      if (data.isSuper_admin === true) {
        navigate("/add-teacher");
      } else {
        navigate("/class");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-[#0a0a0a]'>
      <form
        onSubmit={handleLogin}
        className='bg-[#0a0a0a] p-8 rounded-2xl shadow-lg w-80 border border-blue-600 shadow-[0_0_25px_rgba(0,102,255,0.3)]'
      >
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-100'>
          Login
        </h2>

        {error && <p className='text-red-400 text-center mb-2'>{error}</p>}

        <input
          type='email'
          placeholder='Email'
          className='w-full p-3 caret-white bg-[#121212] text-white placeholder-gray-400 rounded-md mb-3
           border border-gray-700 outline-none focus:ring-1 focus:ring-blue-600 shadow-[0_0_25px_rgba(0,102,255,0.0)] transition-all duration-300'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput password={password} setPassword={setPassword} />

        <div className='flex justify-end'>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-600 text-white rounded-md border border-transparent
  hover:border-blue-500 hover:shadow-[0_0_20px_rgba(0,102,255,0.7)]
  transition-all duration-300 focus:outline-none hover:bg-blue-600 active:scale-[0.98]'
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
