import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchUsers,
  updateUser,
  type User,
  type UserUpdatePayload,
} from "../utils/api";
import { UserEditForm } from "./UserEditForm";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers(currentPage, searchQuery);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const handleUpdateUser = async (id: number, data: UserUpdatePayload) => {
    try {
      await updateUser(id, data);
      await loadUsers();
    } catch (err) {
      throw new Error("Failed to update user");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page users-page"
    >
      <h1>Zarządzanie Użytkownikami</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Szukaj użytkowników..."
          className="search-input"
        />
        <button type="submit">Szukaj</button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="error-message"
        >
          {error}
        </motion.div>
      )}

      <div className="users-list">
        {loading ? (
          <div className="loading">Ładowanie użytkowników...</div>
        ) : (
          <AnimatePresence mode="wait">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`user-card ${
                  editingUser?.id === user.id ? "editing" : ""
                }`}
              >
                {editingUser?.id === user.id ? (
                  <UserEditForm
                    user={user}
                    onSubmit={handleUpdateUser}
                    onCancel={() => setEditingUser(null)}
                  />
                ) : (
                  <>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                      <p>
                        <span className={`status ${user.status}`}>
                          {user.status}
                        </span>
                        <span className="gender">{user.gender}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={users.length < 10 || loading}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
