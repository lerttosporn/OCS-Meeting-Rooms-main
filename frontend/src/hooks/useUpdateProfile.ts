import { useState } from 'react';
import { API_BASE_URL } from '../App';

export interface UpdateProfilePayload {
  first_name: string;
  last_name?: string;
  phone_number?: string;
  position?: string;
}

export interface UpdateProfileErrors {
  first_name?: string;
  phone_number?: string;
  position?: string;
}

function validate(payload: UpdateProfilePayload): UpdateProfileErrors {
  const errors: UpdateProfileErrors = {};
  if (!payload.first_name.trim()) {
    errors.first_name = 'กรุณาระบุชื่อ';
  }
  if (payload.phone_number && !/^[0-9]{7,10}$/.test(payload.phone_number.replace(/[-\s]/g, ''))) {
    errors.phone_number = 'เบอร์โทรศัพท์ไม่ถูกต้อง (ตัวเลข 7-10 หลัก)';
  }
  return errors;
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<UpdateProfileErrors>({});

  const updateProfile = async (
    userId: number,
    payload: UpdateProfilePayload
  ): Promise<boolean> => {
    // Validate first
    const errors = validate(payload);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }
    setValidationErrors({});

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('ocs_token');
      // Strip formatting chars so varchar(10) in DB is not exceeded
      const cleanPayload = {
        ...payload,
        phone_number: payload.phone_number
          ? payload.phone_number.replace(/[-\s()]/g, '')
          : undefined,
      };
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(cleanPayload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `เกิดข้อผิดพลาด (HTTP ${res.status})`);
      }

      const updated = await res.json();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return updated;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[useUpdateProfile]', msg);
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  return { updateProfile, loading, error, success, validationErrors, clearErrors };
}
