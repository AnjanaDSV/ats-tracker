import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'TRACK — Job Application Tracker',
  description: 'Track your job applications with AI-powered keyword insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream-50 text-bark-800">
        <div className="flex min-h-screen">
          <Navigation />
          {/* push content past fixed sidebar */}
          <main className="flex-1 ml-60 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
