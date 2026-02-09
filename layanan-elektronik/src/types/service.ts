export interface Service {
  id: number;
  name: string;
  description: string;
  price_start: number;
  estimated_time: string;
  status: "active" | "inactive";
}

export interface CreateServiceData {
  name: string;
  description: string;
  price_start: number;
  estimated_time: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  price_start?: number;
  estimated_time?: string;
  status?: "active" | "inactive";
}
