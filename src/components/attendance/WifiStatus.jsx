// shows if the user is on the right wifi network
function WifiStatus({ isConnected }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
      <span className="text-gray-600">
        {isConnected ? 'On campus WiFi' : 'Not on campus WiFi'}
      </span>
    </div>
  )
}
export default WifiStatus
