import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

export interface NetworkPackage {
  package_id: number;
  name: string;
  internet: boolean;
  server_installation: boolean;
  technical_info?: string;
}

export function useNetworkPackages() {
  const [packages, setPackages] = useState<NetworkPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/network-packages`);
        if (!res.ok) {
          throw new Error(`Error fetching network packages: ${res.statusText}`);
        }
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { packages, loading, error };
}
