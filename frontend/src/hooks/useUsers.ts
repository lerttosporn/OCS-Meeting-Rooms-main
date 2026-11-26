import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../App';

export type UserRole = 'customer' | 'staff_tech' | 'admin' | 'financial';

export interface User {
  id: number;
  org_id: number;
  org_name?: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name?: string;
  card_id?: string;
  phone_number?: string;
  position?: string;
  created_at: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/users`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data: User[] = await res.json();
      setUsers(data);
    } catch (e) {
      console.error('[useUsers] Failed to load users:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: number, dto: Partial<User> & { password?: string }) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    await fetchUsers();
    return res.json();
  }, [fetchUsers]);

  const createUser = useCallback(async (dto: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    role: UserRole;
    phone_number?: string;
    position?: string;
    org_id: number;
    card_id?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    await fetchUsers();
    return res.json();
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    await fetchUsers();
    return res.json();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers, createUser, updateUser, deleteUser };
}
