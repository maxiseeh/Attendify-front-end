import api from './api'
 
// login
export const loginUser = (email, password) => api.post('/auth/login', { email, password })
 
// get current logged in user
export const getCurrentUser = () => api.get('/auth/me')
 
// register new user
export const registerUser = (data) => api.post('/auth/register', data)
 