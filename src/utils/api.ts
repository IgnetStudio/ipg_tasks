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
  "318afc8b2bb5dd3474a9379c0efc5e59245dc4ca4dcd46f0d2dcb3ab59019ca4"; // Should be replaced with a real token from gorest.co.in
const API_BASE_URL = "https://gorest.co.in/public/v2";

// Cache for storing fetched users
const userCache = new Map<string, { data: User[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const fetchUsers = async (
  page: number = 1,
  searchQuery: string = ""
): Promise<User[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: "12",
    // Sort by id to maintain consistent order
    sort: "id",
    order: "asc",
  });

  if (searchQuery) {
    params.append("name", searchQuery);
  }

  const cacheKey = params.toString();
  const now = Date.now();
  const cached = userCache.get(cacheKey);

  // Return cached data if it exists and is not expired
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users?${params}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Cache the results
    userCache.set(cacheKey, {
      data,
      timestamp: now,
    });

    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    // If we have cached data, return it as fallback
    if (cached) {
      console.log("Returning cached data as fallback");
      return cached.data;
    }
    throw error;
  }
  // Remove redundant code as it's already handled in try-catch block
};

export const updateUser = async (
  id: number,
  data: UserUpdatePayload
): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update user: ${response.status} ${response.statusText}`
      );
    }

    const updatedUser = await response.json();

    // Update all cached data that contains this user
    userCache.forEach((cache, key) => {
      const updatedData = cache.data.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
      );
      userCache.set(key, { data: updatedData, timestamp: Date.now() });
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
