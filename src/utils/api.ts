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
  process.env.BUN_PUBLIC_API_TOKEN || import.meta.env.BUN_PUBLIC_API_TOKEN;
const API_BASE_URL = "https://gorest.co.in/public/v2";

// Cache for storing fetched users
const userCache = new Map<string, { data: User[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const FETCH_TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRIES = 3; // Maximum number of retry attempts

// Fetch with timeout and retry
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  retryCount = 0
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
        ...options.headers,
      },
    });

    if (!response.ok && retryCount < MAX_RETRIES) {
      // Exponential backoff delay
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithTimeout(url, options, retryCount + 1);
    }

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

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
    const response = await fetchWithTimeout(`${API_BASE_URL}/users?${params}`, {
      method: "GET",
      headers: {},
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected an array of users");
    }

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
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching users");
  }
  // Remove redundant code as it's already handled in try-catch block
};

export const updateUser = async (
  id: number,
  data: UserUpdatePayload
): Promise<User> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {},
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update user: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const updatedUser = await response.json();

    if (!updatedUser || typeof updatedUser !== "object") {
      throw new Error("Invalid response format: expected a user object");
    }

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
