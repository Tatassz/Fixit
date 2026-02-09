export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role?: string;
  created_at: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
}
