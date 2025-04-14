'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FieldConfig, useDynamicForm } from '@/hooks/useDynamicForm';


// Define the shape of the fields for the registration form
type RegisterFormFields = {
  name: string;
  email: string;
  password: string;
  profilePic: string;
  error: string;
  loading: boolean;
  showPassword: boolean;
};

const RegisterPage = () => {
  const router = useRouter();
  
  // Define the fields with initial values for the registration form
  const fieldConfig: FieldConfig<RegisterFormFields>[] = [
    { name: 'name', initialValue: '' },
    { name: 'email', initialValue: '' },
    { name: 'password', initialValue: '' },
    { name: 'profilePic', initialValue: '' },
    { name: 'error', initialValue: '' },
    { name: 'loading', initialValue: false },
    { name: 'showPassword', initialValue: false },
  ];

  // Use the dynamic form hook
  const { formState, setField } = useDynamicForm<RegisterFormFields>(fieldConfig);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setField('loading', true);
    setField('error', '');

    try {
      // Send the registration data to the backend API
      const response = await axios.post('/api/auth/register', {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        profilePic: formState.profilePic || 'https://randomuser.me/api/portraits/women/50.jpg', // Default profile picture
      });

      // Store the JWT token received in localStorage or cookies
      localStorage.setItem('authToken', response.data.token);

      setField('loading', false);
      alert('Registration successful!');
      router.push('/dashboard'); // Redirect to dashboard after successful registration
    } catch (error) {
      setField('loading', false);
      setField('error', error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">🔑 Create Account</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Please register to create a new account</p>

      {/* Error message */}
      {formState.error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {formState.error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        {/* Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          value={formState.name}
          onChange={(e) => setField('name', e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

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

        {/* Profile Picture Input */}
        <input
          type="text"
          placeholder="Profile Picture URL (Optional)"
          value={formState.profilePic}
          onChange={(e) => setField('profilePic', e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
          disabled={formState.loading}
        >
          {formState.loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-600 hover:underline">
          Log in here
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
