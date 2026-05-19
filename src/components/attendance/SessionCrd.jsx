// card that shows info about one attendance session

function SessionCrd({ session }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-gray-800">{session?.name || 'Session Name'}</h3>
      <p className="text-sm text-gray-500 mt-1">Date: {session?.date || 'N/A'}</p>
      <p className="text-sm text-gray-500">Status: {session?.status || 'Active'}</p>
    </div>
  )
}

export default SessionCrd
