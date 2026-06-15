export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  roles: string[];
}

export interface JwtResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  roles: string[];
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  errors?: Record<string, string>;
}

export interface CreateStaffRequest {
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}
