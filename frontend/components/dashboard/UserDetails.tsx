const UserDetails = ({ email, uuid }: { email: string; uuid: string }) => (
    <div className="mb-6">
      <p><strong>Email:</strong> {email}</p>
      <p><strong>User ID:</strong> {uuid}</p>
    </div>
  );
  
  export default UserDetails;