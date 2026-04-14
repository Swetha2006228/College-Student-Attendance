import { useState } from "react";
import { Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";

export default function AddTeacherPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/add-teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setSuccess("Teacher added successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-[#0a0a0a]'>
      <form
        onSubmit={handleAddTeacher}
        className='bg-[#0a0a0a] p-8 rounded-2xl shadow-lg w-80 border border-blue-600 shadow-[0_0_25px_rgba(0,102,255,0.3)] transition-all duration-300'
      >
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-100'>
          Add Teacher
        </h2>

        {error && <p className='text-red-400 text-center mb-2'>{error}</p>}
        {success && (
          <p className='text-green-400 text-center mb-2'>{success}</p>
        )}

        <input
          type='text'
          placeholder='Name'
          className='w-full p-3 bg-[#121212] text-white placeholder-gray-400 rounded-md mb-3
           border border-gray-700 outline-none focus:ring-1 focus:ring-blue-600 transition-all duration-300'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type='email'
          placeholder='Email'
          className='w-full p-3 bg-[#121212] text-white placeholder-gray-400 rounded-md mb-3
           border border-gray-700 outline-none focus:ring-1 focus:ring-blue-600 transition-all duration-300'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput password={password} setPassword={setPassword} />

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-md border border-transparent 
          hover:border-blue-500 hover:shadow-[0_0_15px_rgba(0,102,255,0.6)] 
          transition-all duration-300 focus:outline-none'
        >
          Add Teacher
        </button>

        <p className='text-center text-sm mt-4 text-gray-400'>
          Back to{" "}
          <Link to='/' className='text-blue-400 hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
