import api from './api'

export const loginUser = (email, password, passphrase) =>
  api.post('/auth/login', {
    email,
    password,
    ...(passphrase ? { passphrase } : {}),
  })

export const registerUser = (data) => api.post('/auth/register', data)

export const getProfile = () => api.get('/auth/profile')

export const saveMac = (mac_address) => api.post('/auth/mac', { mac_address })

export const generateBatchCode = () => api.post('/auth/generate-batch-code')