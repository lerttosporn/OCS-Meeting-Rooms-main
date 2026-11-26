import { useState, useRef, useEffect, useMemo } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { UserRole } from '../App';
import buildingImg from '../assets/ocs-building.jpg';
import thaiAddressData from '../utils/thai_address.json';
import { useOrganizations } from '../hooks/useOrganizations';

interface LoginPageProps {
  isDarkMode: boolean;
  onLogin: (userData: any, token: string) => void;
  onNavigateHome: () => void;
}



export function LoginPage({ onLogin }: LoginPageProps) {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Register modal state
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Department Dropdown state
  const { organizations, addOrganization } = useOrganizations();
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const deptRef = useRef<HTMLDivElement>(null);

  // Address for new Organization
  const [addressLine, setAddressLine] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [zipcode, setZipcode] = useState('');

  const provinces = useMemo(() => Array.from(new Set(thaiAddressData.map(d => d.province))).sort(), []);

  const districts = useMemo(() => {
    if (!selectedProvince) return [];
    return Array.from(new Set(thaiAddressData.filter(d => d.province === selectedProvince).map(d => d.amphoe))).sort();
  }, [selectedProvince]);

  const subdistricts = useMemo(() => {
    if (!selectedProvince || !selectedDistrict) return [];
    return Array.from(new Set(thaiAddressData.filter(d => d.province === selectedProvince && d.amphoe === selectedDistrict).map(d => d.district))).sort();
  }, [selectedProvince, selectedDistrict]);

  const handleSubdistrictChange = (subdistrictName: string) => {
    setSelectedSubdistrict(subdistrictName);
    const match = thaiAddressData.find(d => d.province === selectedProvince && d.amphoe === selectedDistrict && d.district === subdistrictName);
    if (match) {
      setZipcode(match.zipcode.toString());
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setShowDeptDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDepts = organizations.filter(org => org.org_name.toLowerCase().includes(regDepartment.toLowerCase()));
  const exactMatch = organizations.find(org => org.org_name.toLowerCase() === regDepartment.trim().toLowerCase());


  // Hover states
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverGoogle, setHoverGoogle] = useState(false);
  const [hoverReg, setHoverReg] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleFormLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoginError('');
    if (!validateEmail(email)) { setLoginError('รูปแบบอีเมลไม่ถูกต้อง'); return; }
    if (password.length < 4) { setLoginError('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'); return; }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      onLogin(data.user, data.token);
    } catch (err: any) {
      let msg = err.message;
      if (Array.isArray(msg)) msg = msg[0];
      setLoginError(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    const clientId = '425418224600-gdcmb7h6rq49nuc08frjrr5bosjgolo1.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3000/api/auth/callback/google';
    const scope = encodeURIComponent('email profile');
    const responseType = 'id_token token';
    const nonce = Math.random().toString(36).substring(2);

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${encodeURIComponent(responseType)}&scope=${scope}&nonce=${nonce}`;

    window.location.href = url;
  };


  const handleRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setRegError('');
    if (!regName.trim()) { setRegError('กรุณากรอกชื่อ-นามสกุล'); return; }
    if (!regDepartment.trim()) { setRegError('กรุณากรอกชื่อหน่วยงาน/สังกัด'); return; }
    if (!validateEmail(regEmail)) { setRegError('รูปแบบอีเมลไม่ถูกต้อง'); return; }
    if (regPassword.length < 6) { setRegError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return; }
    if (regPassword !== regConfirm) { setRegError('รหัสผ่านไม่ตรงกัน'); return; }

    setRegLoading(true);
    try {
      let finalOrgId = 1;
      let finalOrgName = regDepartment.trim();

      if (exactMatch) {
        finalOrgId = exactMatch.org_id;
      } else {
        const addrSub = selectedSubdistrict ? `ต.${selectedSubdistrict}` : '';
        const addrDist = selectedDistrict ? `อ.${selectedDistrict}` : '';
        const addrProv = selectedProvince ? `จ.${selectedProvince}` : '';
        const fullAddress = [addressLine, addrSub, addrDist, addrProv, zipcode].filter(Boolean).join(' ');

        const newOrg = await addOrganization(finalOrgName, fullAddress || '-');
        finalOrgId = newOrg.org_id;
      }

      const nameParts = regName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const res = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          role: 'customer',
          first_name: firstName,
          last_name: lastName,
          phone_number: regPhone || undefined,
          position: finalOrgName,
          org_id: finalOrgId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'การสมัครสมาชิกผิดพลาด');
      }

      setRegSuccess(true);
      setTimeout(() => {
        setShowRegister(false);
        setRegSuccess(false);
        setEmail(regEmail);
        setRegName(''); setRegDepartment(''); setRegEmail('');
        setRegPassword(''); setRegConfirm(''); setRegPhone('');
        setAddressLine(''); setSelectedProvince(''); setSelectedDistrict(''); setSelectedSubdistrict(''); setZipcode('');
      }, 1800);
    } catch (err: any) {
      let msg = err.message;
      if (Array.isArray(msg)) msg = msg[0];
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: "'Noto Sans Thai','Inter',sans-serif" }}>
      {/* ── Left Panel ── */}
      <div style={{ position: 'relative', flex: '1 1 55%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        className="login-left-panel">
        <img src={buildingImg} alt="OCS Building" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(15,32,65,.82),rgba(25,55,110,.6),rgba(15,32,65,.75))' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '3rem', maxWidth: '560px' }}>
          <h1 style={{ margin: 0, lineHeight: 1.1, color: '#fff' }}>
            <span style={{ fontSize: 'clamp(3.5rem,7vw,5.5rem)', fontWeight: 800, letterSpacing: '-2px', display: 'block' }}>OCS</span>
            <span style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, letterSpacing: '2px', display: 'block', marginTop: 4 }}>Meeting Rooms</span>
          </h1>
          <div style={{ width: 60, height: 3, background: 'rgba(255,255,255,.5)', margin: '1.75rem 0', borderRadius: 2 }} />
          <p style={{ fontSize: 'clamp(.85rem,1.4vw,1.05rem)', opacity: .9, margin: 0, color: '#fff' }}>บริการจองห้องประชุมและห้องสำหรับการเรียนการสอน</p>
          <p style={{ fontSize: 'clamp(.8rem,1.2vw,.95rem)', opacity: .7, margin: '.25rem 0 0', color: '#fff' }}>สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ flex: '1 1 45%', background: 'linear-gradient(180deg,#1a3a6e,#1e4080 30%,#2255a8 60%,#1e4080)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}
        className="login-right-panel">
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.03)', top: -80, right: -80 }} />
        <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,.03)', bottom: -60, left: -60 }} />

        <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '2rem', textAlign: 'center', letterSpacing: 1 }}>เข้าสู่ระบบ</h2>

          {/* Form Card */}
          <div style={{ width: '100%', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid rgba(255,255,255,.15)', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                <label style={{ fontSize: '.85rem', fontWeight: 500, color: 'rgba(255,255,255,.7)', paddingLeft: '.25rem' }}>อีเมล</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setLoginError(''); }}
                  placeholder="you@ocs.ac.th"
                  style={{ width: '100%', padding: '.85rem 1rem', borderRadius: '.75rem', border: loginError && !email ? '1.5px solid #f87171' : 'none', outline: 'none', fontSize: '.95rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box', transition: 'box-shadow .2s' }}
                  onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,64,128,.35)'; }}
                  onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  required />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                <label style={{ fontSize: '.85rem', fontWeight: 500, color: 'rgba(255,255,255,.7)', paddingLeft: '.25rem' }}>รหัสผ่าน</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '.85rem 2.8rem .85rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.95rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box', transition: 'box-shadow .2s' }}
                    onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,64,128,.35)'; }}
                    onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
                    required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {loginError && (
                <div style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.4)', borderRadius: '.65rem', padding: '.65rem 1rem', color: '#fca5a5', fontSize: '.85rem' }}>
                  ⚠️ {loginError}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '.9rem', borderRadius: '2rem', border: 'none', background: loading ? 'rgba(255,255,255,.3)' : hoverLogin ? 'linear-gradient(135deg,#22468a,#142d5a)' : 'linear-gradient(135deg,#1a3a6e,#0d2247)', color: '#fff', fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .3s', boxShadow: '0 4px 15px rgba(13,34,71,.4)', marginTop: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transform: hoverLogin && !loading ? 'translateY(-2px)' : 'none' }}
                onMouseEnter={() => setHoverLogin(true)} onMouseLeave={() => setHoverLogin(false)}>
                {loading ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> กำลังเข้าสู่ระบบ...</> : 'เข้าสู่ระบบ  →'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.2)' }} />
              <span style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>หรือ</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.2)' }} />
            </div>

            {/* Google */}
            <button onClick={handleGoogleLogin} disabled={loading}
              style={{ width: '100%', padding: '.8rem', borderRadius: '2rem', border: '1.5px solid rgba(255,255,255,.3)', background: hoverGoogle ? '#fff' : 'rgba(255,255,255,.95)', color: '#374151', fontSize: '.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem', transition: 'all .3s', transform: hoverGoogle && !loading ? 'translateY(-2px)' : 'none', boxShadow: hoverGoogle ? '0 6px 20px rgba(0,0,0,.15)' : 'none' }}
              onMouseEnter={() => setHoverGoogle(true)} onMouseLeave={() => setHoverGoogle(false)}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Register Button */}
          <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '.5rem', color: 'rgba(255,255,255,.7)', fontSize: '.9rem' }}>
            <span>ยังไม่มีบัญชี?</span>
            <button onClick={() => setShowRegister(true)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, opacity: hoverReg ? .8 : 1, transition: 'opacity .2s' }}
              onMouseEnter={() => setHoverReg(true)} onMouseLeave={() => setHoverReg(false)}>
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </div>

      {/* ── Register Modal ── */}
      {showRegister && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.6)', backdropFilter: 'blur(6px)', padding: '1rem' }}
          onClick={() => setShowRegister(false)}>
          <div style={{ background: 'linear-gradient(160deg,#1e4080,#2255a8)', borderRadius: '1.5rem', width: '100%', maxWidth: 440, border: '1px solid rgba(255,255,255,.2)', boxShadow: '0 30px 80px rgba(0,0,0,.4)', position: 'relative', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowRegister(false)}
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <X style={{ width: 16, height: 16 }} />
            </button>

            <div className="hide-scrollbar" style={{ maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}>สมัครสมาชิก</h3>

              {regSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <p style={{ color: '#86efac', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>สมัครสมาชิกสำเร็จ!</p>
                  <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem', marginTop: '.5rem' }}>กำลังพาคุณไปยังหน้าเข้าสู่ระบบ...</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'ชื่อ-นามสกุล', val: regName, set: setRegName, type: 'text', placeholder: 'สมชาย ใจดี' },
                    { label: 'เบอร์โทรศัพท์ ', val: regPhone, set: setRegPhone, type: 'text', placeholder: '0812345678' },
                    { label: 'อีเมล', val: regEmail, set: setRegEmail, type: 'email', placeholder: 'you@ocs.ac.th' },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                      <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>{f.label}</label>
                      <input type={f.type} value={f.val} onChange={e => { f.set(e.target.value); setRegError(''); }}
                        placeholder={f.placeholder} required
                        style={{ width: '100%', padding: '.8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}
                        onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,64,128,.35)'; }}
                        onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }} />
                    </div>
                  ))}

                  {/* Searchable Department Dropdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }} ref={deptRef}>
                    <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>หน่วยงาน / สังกัด</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={e => { setRegDepartment(e.target.value); setRegError(''); setShowDeptDropdown(true); }}
                        onFocus={e => { setShowDeptDropdown(true); e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,64,128,.35)'; }}
                        onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
                        placeholder="เช่น คณะวิทยาศาสตร์, สำนักงานอธิการบดี"
                        required
                        style={{ width: '100%', padding: '.8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}
                      />
                      {showDeptDropdown && (
                        <div className="dropdown-scrollbar" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', borderRadius: '.75rem', boxShadow: '0 10px 25px rgba(0,0,0,.2)', zIndex: 10, maxHeight: 180, overflowY: 'auto' }}>
                          {filteredDepts.map(dept => (
                            <div
                              key={dept.org_id}
                              style={{ padding: '.75rem 1rem', cursor: 'pointer', fontSize: '.9rem', color: '#1a1a2e', borderBottom: '1px solid #f1f5f9' }}
                              onMouseDown={(e) => { e.preventDefault(); setRegDepartment(dept.org_name); setShowDeptDropdown(false); }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              {dept.org_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional fields for New Organization */}
                  {filteredDepts.length === 0 && regDepartment.trim() !== '' && (
                    <div style={{ background: 'rgba(0,0,0,.15)', padding: '1rem', borderRadius: '.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px dashed rgba(255,255,255,.2)' }}>
                      <div style={{ fontSize: '.85rem', fontWeight: 600, color: '#93c5fd' }}> ข้อมูลที่ตั้งหน่วยงาน</div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                        <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>ที่อยู่ (เช่น เลขที่, อาคาร, ซอย)</label>
                        <input type="text" value={addressLine} onChange={e => setAddressLine(e.target.value)} required placeholder="123/45 ซ.สุขุมวิท 1"
                          style={{ width: '100%', padding: '.8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}
                          onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,64,128,.35)'; }} onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                          <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>จังหวัด</label>
                          <select value={selectedProvince} onChange={e => { setSelectedProvince(e.target.value); setSelectedDistrict(''); setSelectedSubdistrict(''); setZipcode(''); }} required
                            style={{ width: '100%', padding: '.8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}>
                            <option value="" disabled>เลือกจังหวัด</option>
                            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                          <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>อำเภอ/เขต</label>
                          <select value={selectedDistrict} onChange={e => { setSelectedDistrict(e.target.value); setSelectedSubdistrict(''); setZipcode(''); }} required disabled={!selectedProvince}
                            style={{ width: '100%', padding: '.8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: !selectedProvince ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}>
                            <option value="" disabled>เลือกอำเภอ/เขต</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                          <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>ตำบล/แขวง</label>
                          <select value={selectedSubdistrict} onChange={e => handleSubdistrictChange(e.target.value)} required disabled={!selectedDistrict}
                            style={{ width: '100%', padding: '.8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: !selectedDistrict ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}>
                            <option value="" disabled>เลือกตำบล/แขวง</option>
                            {subdistricts.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                          <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>รหัสไปรษณีย์</label>
                          <input type="text" value={zipcode} onChange={e => setZipcode(e.target.value)} required placeholder="รหัสไปรษณีย์"
                            style={{ width: '100%', padding: '.8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}
                            onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,64,128,.35)'; }} onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password fields */}
                  {[
                    { label: 'รหัสผ่าน (อย่างน้อย 6 ตัว)', val: regPassword, set: setRegPassword, show: showRegPass, toggle: () => setShowRegPass(!showRegPass) },
                    { label: 'ยืนยันรหัสผ่าน', val: regConfirm, set: setRegConfirm, show: showRegConfirm, toggle: () => setShowRegConfirm(!showRegConfirm) },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                      <label style={{ fontSize: '.82rem', fontWeight: 500, color: 'rgba(255,255,255,.7)' }}>{f.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input type={f.show ? 'text' : 'password'} value={f.val} onChange={e => { f.set(e.target.value); setRegError(''); }}
                          placeholder="••••••••" required
                          style={{ width: '100%', padding: '.8rem 2.8rem .8rem 1rem', borderRadius: '.75rem', border: 'none', outline: 'none', fontSize: '.9rem', fontFamily: 'inherit', background: 'rgba(255,255,255,.95)', color: '#1a1a2e', boxSizing: 'border-box' }}
                          onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,64,128,.35)'; }}
                          onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }} />
                        <button type="button" onClick={f.toggle}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, display: 'flex', alignItems: 'center' }}>
                          {f.show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {regError && (
                    <div style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.4)', borderRadius: '.65rem', padding: '.6rem 1rem', color: '#fca5a5', fontSize: '.83rem' }}>
                      ⚠️ {regError}
                    </div>
                  )}

                  <button type="submit" disabled={regLoading}
                    style={{ width: '100%', padding: '.9rem', borderRadius: '2rem', border: 'none', background: regLoading ? 'rgba(255,255,255,.3)' : 'linear-gradient(135deg,#1a3a6e,#0d2247)', color: '#fff', fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit', cursor: regLoading ? 'not-allowed' : 'pointer', marginTop: '.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {regLoading ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> กำลังสมัครสมาชิก...</> : 'สมัครสมาชิก'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { flex: 1 1 100% !important; }
        }
      `}</style>
    </div>
  );
}
