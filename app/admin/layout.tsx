import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import Sidebar from './components/Sidebar';
import { SessionProvider } from './components/SessionProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin-login');
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-[#111]">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <div />
              <div className="flex items-center gap-3">
                <span className="font-montserrat text-[#F0E6C2]/60 text-xs tracking-wide">
                  {session.user.name}
                </span>
                <span className="font-montserrat text-[#BFA06A]/60 text-[0.6rem] tracking-[0.2em] uppercase bg-[#BFA06A]/10 px-2 py-1 rounded">
                  {session.user.role}
                </span>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
