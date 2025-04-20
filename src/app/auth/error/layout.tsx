import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เกิดข้อผิดพลาด | KR Pharma',
  description: 'เกิดข้อผิดพลาดในการเข้าถึงบัญชีของคุณ',
};

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
  return children;
} 