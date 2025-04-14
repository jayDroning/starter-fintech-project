'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FieldConfig, useDynamicForm } from '@/hooks/useDynamicForm';



// Define the shape of the fields for the login form
type LoginFormFields = {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  showPassword: boolean;
};

const LoginPage = () => {
  const router = useRouter();
  
  // Define the fields with initial values for the login form
  const fieldConfig: FieldConfig<LoginFormFields>[] = [
    { name: 'email', initialValue: '' },
    { name: 'password', initialValue: '' },
    { name: 'error', initialValue: '' },
    { name: 'loading', initialValue: false },
    { name: 'showPassword', initialValue: false },
  ];

  const { formState, setField } = useDynamicForm(fieldConfig);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setField('loading', true);
    setField('error', '');

    try {
      // Call the login API
      const response = await axios.post('/api/auth/login', {
        email: formState.email,
        password: formState.password,
      });

      // Store the JWT token received in localStorage or cookies
      localStorage.setItem('authToken', response.data.token);

      setField('loading', false);
      alert('Login successful!');
      // Redirect to the dashboard or home page
      router.push('/dashboard');
    } catch (error) {
      setField('loading', false);
      setField('error', 'Invalid email or password');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">🔐 Welcome Back!</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Please log in to your account</p>

      {/* Error message */}
      {formState.error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {formState.error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={formState.email}
          onChange={(e) => setField('email', e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={formState.showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formState.password}
            onChange={(e) => setField('password', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setField('showPassword', !formState.showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {formState.showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold"
          disabled={formState.loading}
        >
          {formState.loading ? 'Logging in...' : '👉 Log In'}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        Don't have an account?{' '}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
