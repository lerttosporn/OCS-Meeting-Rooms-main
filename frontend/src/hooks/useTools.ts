import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

export interface Tool {
  tool_id: number;
  name: string;
  description?: string;
  unit_price: number | string;
  stock: number;
  image_url?: string;
  status?: string;
}

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/tools`);
      if (!res.ok) throw new Error('Failed to fetch tools');
      
      const data = await res.json();
      setTools(data);
    } catch (err) {
      console.error('[useTools] Error fetching tools', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const createTool = async (toolData: Omit<Tool, 'tool_id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
        body: JSON.stringify(toolData),
      });
      if (!res.ok) throw new Error('Failed to create tool');
      await fetchTools();
      return await res.json();
    } catch (err) {
      console.error('[useTools] Error creating tool', err);
      throw err;
    }
  };

  const updateTool = async (id: number, toolData: Partial<Omit<Tool, 'tool_id'>>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tools/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
        body: JSON.stringify(toolData),
      });
      if (!res.ok) throw new Error('Failed to update tool');
      await fetchTools();
      return await res.json();
    } catch (err) {
      console.error('[useTools] Error updating tool', err);
      throw err;
    }
  };

  const deleteTool = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tools/${id}`, {
        method: 'DELETE',
        headers: {
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to delete tool');
      await fetchTools();
    } catch (err) {
      console.error('[useTools] Error deleting tool', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return { tools, loading, error, refetch: fetchTools, createTool, updateTool, deleteTool };
}
