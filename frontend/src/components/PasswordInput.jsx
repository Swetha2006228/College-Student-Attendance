import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

export default function PasswordInput({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative'>
      <input
        type={showPassword ? "text" : "password"}
        placeholder='Password'
        className='w-full p-3 bg-[#121212] caret-white text-white placeholder-gray-400 rounded-md mb-3
        border border-gray-700 outline-none focus:ring-1 focus:ring-blue-600 pr-10'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='absolute right-3 top-3 text-gray-300 hover:text-white transition'
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
