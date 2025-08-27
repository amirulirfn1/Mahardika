export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "agent" | "viewer";
};

export type Activity = {
  id: string;
  userId: string;
  description: string;
  timestamp: string;
};

export const users: User[] = [
  { id: "u_1", name: "Ayu Pratama", email: "ayu@example.com", role: "admin" },
  { id: "u_2", name: "Bima Santosa", email: "bima@example.com", role: "manager" },
  { id: "u_3", name: "Citra Dewi", email: "citra@example.com", role: "agent" },
  { id: "u_4", name: "Dimas Nugraha", email: "dimas@example.com", role: "viewer" },
];

export const activity: Activity[] = [
  {
    id: "a_1",
    userId: "u_2",
    description: "Created a new policy for John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "a_2",
    userId: "u_3",
    description: "Received payment for Policy #POL-1024",
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
  {
    id: "a_3",
    userId: "u_1",
    description: "Updated customer profile: Siti Aminah",
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
];



