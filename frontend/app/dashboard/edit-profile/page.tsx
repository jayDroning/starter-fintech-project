'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch user data when the page loads
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setName(data.name);
          setEmail(data.email);
          setProfilePic(data.profilePic || 'https://via.placeholder.com/150'); // Default profile pic if not provided
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    const updatedData = { name, email, profilePic };

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Profile updated successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating profile');
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
        
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="mb-4 flex justify-center">
            <img
              src={profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 mb-4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Save Changes Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}