import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../App';

export interface Organization {
  org_id: number;
  org_name: string;
  org_type: string;
  org_code: string;
  address: string;
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/organizations`);
      if (!res.ok) throw new Error('Failed to fetch organizations');
      const data = await res.json();
      setOrganizations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrganization = async (name: string, address: string = '-'): Promise<Organization> => {
    const token = localStorage.getItem('ocs_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/organizations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        org_name: name,
        org_type: 'other',
        org_code: 'ORG_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        address: address
      }),
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to add organization');
    }
    
    const newItem = await res.json();
    setOrganizations(prev => [...prev, newItem]);
    return newItem;
  };

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return { organizations, loading, error, fetchOrganizations, addOrganization };
}
