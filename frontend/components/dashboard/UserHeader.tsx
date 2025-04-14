type Props = {
  name: string;
  email: string;
  profilePic?: string;
};

const UserHeader = ({ name, email, profilePic }: Props) => (
  <>
    <h2 className="text-2xl font-bold mb-4 text-center">👋 Welcome, {name}</h2>
    <div className="flex items-center mb-6">
      <img
        src={profilePic || 'https://via.placeholder.com/150'}
        alt="Profile"
        className="w-16 h-16 rounded-full mr-4"
      />
      <div>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm text-gray-600">{email}</p>
      </div>
    </div>
  </>
);

export default UserHeader;
