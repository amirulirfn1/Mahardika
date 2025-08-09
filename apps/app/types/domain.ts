export type Agency = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  phone?: string | null;
};

export type Customer = {
  id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  created_at: string;
};

export type Vehicle = {
  id: string;
  customer_id: string;
  plate_no: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  created_at: string;
};


