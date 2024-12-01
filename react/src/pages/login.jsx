import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();


  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateCredentials(role, email, password);
    
    if (isValid) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const validateCredentials = async (role, email, password) => {
    const response = await fetch(`/api/${role}s`, { // I love this "s"
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (!response.ok) {
      return false;
    }
  
    const users = await response.json();
  
    // Comparison
    const user = users.find(user => user.email === email && user.password === password);
  
    return !!user;
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <button 
              type="button" 
              onClick={() => handleRoleChange('student')}
              className={`w-full px-4 py-2 border rounded ${
                role === 'student' ? 'bg-blue-500 text-white' : 'border-gray-300'
              }`}
            >
              Student
            </button>
            
            <button 
              type="button" 
              onClick={() => handleRoleChange('instructor')}
              className={`w-full px-4 py-2 border rounded ${
                role === 'instructor' ? 'bg-blue-500 text-white' : 'border-gray-300'
              }`}
            >
              Instructor
            </button>
          </div>
          
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
