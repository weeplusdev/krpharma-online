'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLineLoading, setIsLineLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('กำลังเข้าสู่ระบบด้วย:', formData.email);
      
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      console.log('ผลลัพธ์การเข้าสู่ระบบ:', result);

      if (result?.error) {
        console.error('เกิดข้อผิดพลาด:', result.error);
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        toast.success('เข้าสู่ระบบสำเร็จ');
        router.push('/products');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error (detail):', error);
      toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineLogin = async () => {
    setIsLineLoading(true);
    try {
      await signIn('line', { callbackUrl: '/products' });
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย LINE');
      console.error('LINE login error:', error);
      setIsLineLoading(false);
      router.push('/auth/error?error=line_login_failed');
    }
  };

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
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
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
              จดจำฉัน
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            หรือเข้าสู่ระบบด้วย
          </span>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleLineLogin}
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
          {isLineLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย LINE'}
        </button>
      </div>
    </div>
  );
} 