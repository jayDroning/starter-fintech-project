
type Props = {
    onEdit: any,
    onLogout: any
}

const ProfileActions = ({onEdit, onLogout}: Props) => (
    <div className="flex justify-between">
        <button
            onClick={onEdit()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
        >
            Edit Profile
        </button>
        <button
            onClick={() => {onLogout()}}
            className="bg-red-600 text-white px-4 py-2 rounded"
        >
            Log Out
        </button>
    </div>
)

export default ProfileActions;