'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLineLoading, setIsLineLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    
    if (!formData.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (formData.password.length < 8) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
      
      toast.success('ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ');
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineRegister = async () => {
    setIsLineLoading(true);
    try {
      await signIn('line', { callbackUrl: '/products' });
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลงทะเบียนด้วย LINE');
      console.error('LINE registration error:', error);
      setIsLineLoading(false);
      router.push('/auth/error?error=line_login_failed');
    }
  };

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            ชื่อ-นามสกุล
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            อีเมล
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            รหัสผ่าน
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            ยืนยันรหัสผ่าน
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
          </button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            หรือลงทะเบียนด้วย
          </span>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleLineRegister}
          disabled={isLineLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 36 36"
          >
            <path 
              fill="#FFFFFF" 
              d="M32,8.5c0-0.654-0.419-1.208-1-1.414V5.5c0-0.276-0.224-0.5-0.5-0.5S30,5.224,30,5.5v1.586c-0.581,0.206-1,0.76-1,1.414 c0,0.654,0.419,1.208,1,1.414V13c0,0.276,0.224,0.5,0.5,0.5S31,13.276,31,13V9.914C31.581,9.708,32,9.154,32,8.5z M17.5,22 c-0.552,0-1-0.448-1-1v-6c0-0.552,0.448-1,1-1s1,0.448,1,1v6C18.5,21.552,18.052,22,17.5,22z M24.5,22c-0.552,0-1-0.448-1-1v-3h-1 c-0.552,0-1-0.448-1-1s0.448-1,1-1h2c0.552,0,1,0.448,1,1v4C25.5,21.552,25.052,22,24.5,22z M9.5,22c-0.552,0-1-0.448-1-1v-4 c0-0.552,0.448-1,1-1h2c0.552,0,1,0.448,1,1s-0.448,1-1,1h-1v3C10.5,21.552,10.052,22,9.5,22z M14,21.5c0,0.276-0.224,0.5-0.5,0.5 h-1c-0.276,0-0.5-0.224-0.5-0.5v-5c0-0.276,0.224-0.5,0.5-0.5h1c0.276,0,0.5,0.224,0.5,0.5v1c0,0.276-0.224,0.5-0.5,0.5 S13,17.776,13,17.5V17h-0.5v4H13v-1c0-0.276,0.224-0.5,0.5-0.5s0.5,0.224,0.5,0.5V21.5z M18,5C9.716,5,3,10.612,3,17.5 C3,22.964,7.426,27.61,13.558,29.328c0.844,0.199,1.992,0.61,2.282,1.399c0.258,0.708,0.169,1.814,0.082,2.528 c0,0-0.328,1.967,1.721,1.072c2.049-0.895,11.048-6.504,15.072-11.138C35.764,19.897,36,18.34,36,17.5C36,10.612,29.284,5,18,5z"
            />
          </svg>
          {isLineLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนด้วย LINE'}
        </button>
      </div>
    </div>
  );
} 