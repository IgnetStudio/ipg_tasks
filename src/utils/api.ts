export interface User {
  id: number;
  name: string;
  email: string;
  gender: "male" | "female";
  status: "active" | "inactive";
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  gender?: "male" | "female";
  status?: "active" | "inactive";
}

const API_TOKEN =
  "318afc8b2bb5dd3474a9379c0efc5e59245dc4ca4dcd46f0d2dcb3ab59019ca4"; // Należy zastąpić prawdziwym tokenem z gorest.co.in
const API_BASE_URL = "https://gorest.co.in/public/v2";

export const fetchUsers = async (
  page: number = 1,
  searchQuery: string = ""
): Promise<User[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: "10",
  });

  if (searchQuery) {
    params.append("name", searchQuery);
  }

  const response = await fetch(`${API_BASE_URL}/users?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const updateUser = async (
  id: number,
  data: UserUpdatePayload
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};
