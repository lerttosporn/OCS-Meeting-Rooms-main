import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

export interface Catering {
  catering_id: number;
  name: string;
  description?: string;
}

export function useCatering() {
  const [caterings, setCaterings] = useState<Catering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCaterings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/catering`);
      if (!res.ok) throw new Error('Failed to fetch caterings');
      
      const data = await res.json();
      setCaterings(data);
    } catch (err) {
      console.error('[useCatering] Error fetching caterings', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const createCatering = async (cateringData: Omit<Catering, 'catering_id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/catering`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
        body: JSON.stringify(cateringData),
      });
      if (!res.ok) throw new Error('Failed to create catering');
      await fetchCaterings();
      return await res.json();
    } catch (err) {
      console.error('[useCatering] Error creating catering', err);
      throw err;
    }
  };

  const updateCatering = async (id: number, cateringData: Partial<Omit<Catering, 'catering_id'>>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/catering/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
        body: JSON.stringify(cateringData),
      });
      if (!res.ok) throw new Error('Failed to update catering');
      await fetchCaterings();
      return await res.json();
    } catch (err) {
      console.error('[useCatering] Error updating catering', err);
      throw err;
    }
  };

  const deleteCatering = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/catering/${id}`, {
        method: 'DELETE',
        headers: {
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to delete catering');
      await fetchCaterings();
    } catch (err) {
      console.error('[useCatering] Error deleting catering', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCaterings();
  }, []);

  return { caterings, loading, error, refetch: fetchCaterings, createCatering, updateCatering, deleteCatering };
}
