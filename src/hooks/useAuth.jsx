import { useContext } from 'react'
import { AuthContext } from '../AuthContext'

// hook to easily get auth info in any component
function useAuth() {
  return useContext(AuthContext)
}

export default useAuth
