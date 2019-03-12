export interface UserResponse {
  success: boolean
  message: string
  token?: string
  value?: User
}

export interface User {
  _id?: string
  provider?: string
  password?: string
  name?: string
  email?: string
  image?: string
}
