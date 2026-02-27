import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IB Task Manager',
  description: 'Investment Banking Task Management & Kanban Board',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
