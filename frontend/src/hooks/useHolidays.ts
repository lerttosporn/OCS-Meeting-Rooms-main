import { useState, useEffect } from 'react';

export function useHolidays() {
  const [holidays, setHolidays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      const currentYear = new Date().getFullYear();
      // ใช้ Nager.Date API ซึ่งเป็น Public API ไม่ต้องใช้ API Key
      const url = `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/TH`;

      try {
        setLoading(true);
        const res = await fetch(url);

        if (!res.ok) {
          console.error('Failed to fetch holidays:', res.status);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          const dates = data.map((item: any) => item.date);
          setHolidays(dates);
        }
      } catch (err) {
        console.error('Error fetching holidays:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  return { holidays, loading };
}
