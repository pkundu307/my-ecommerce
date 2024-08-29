// src/components/LoginForm.tsx

import React from 'react';


const LoginForm: React.FC = () => {
  return (
   <>

<div className="max-w-md mx-auto p-4 border-rounded-md">
      <h2 className="text-xl font-semibold mb-4 ">Login</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full border rounded-md py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="w-full border rounded-md py-2 px-3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
   </>
  );
};

export default LoginForm;
