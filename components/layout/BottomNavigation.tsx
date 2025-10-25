// components/layout/BottomNavigation.tsx
    "use client";

    import Link from 'next/link'
    import { usePathname } from 'next/navigation'
    import { Home, PlusCircle, Users, BarChart3, User } from 'lucide-react'


    const BottomNavigation = () => {
      const pathname = usePathname();

      const navItems = [
        {
          href: '/dashboard',
          icon: Home,
          label: 'होम',
          labelEn: 'Home'
        },
        {
          href: '/groups',
          icon: Users,
          label: 'ग्रुप',
          labelEn: 'Groups'
        },
        {
          href: '/dashboard/analytics',
          icon: BarChart3,
          label: 'चार्ट',
          labelEn: 'Analytics'
        },
        {
          href: '/profile',
          icon: User,
          label: 'प्रोफाइल',
          labelEn: 'Profile'
        }
      ];

      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center min-w-[60px] relative"
                >
                  <span
                    className={`
                      flex flex-col items-center justify-center w-full px-3 py-1 rounded-lg transition
                      ${isActive ? 'bg-[#FF9933]' : ''}`} style={{ minWidth: 48 }}>
                    <Icon
                      size={24}
                      className={`transition ${isActive ? 'text-black' : 'text-gray-500'}`}
                      style={{ zIndex: 10 }}
                    />
                    <span
                      className={`
                        text-xs mt-1 font-medium transition
                        ${isActive ? 'text-black' : 'text-gray-500'}
                      `}
                      style={{ zIndex: 10 }}
                    >
                      {item.labelEn}
                    </span>
                  </span>
                </Link>
              );
            })}
            <Link
              href="/incomes/add"
              className="flex flex-col items-center justify-center min-w-[60px] relative"
            >
              <span
                className={`
                  flex flex-col items-center justify-center w-full px-3 py-1 rounded-lg transition
                  ${pathname === '/incomes/add' ? 'bg-[#FF9933]' : ''}`} style={{ minWidth: 48 }}>
                <PlusCircle
                  size={24}
                  className={`transition ${pathname === '/incomes/add' ? 'text-black' : 'text-gray-500'}`}
                  style={{ zIndex: 10 }}
                />
                <span
                  className={`
                    text-xs mt-1 font-medium transition
                    ${pathname === '/incomes/add' ? 'text-black' : 'text-gray-500'}
                  `}
                  style={{ zIndex: 10 }}
                >
                  Income
                </span>
              </span>
            </Link>
          </div>
        </div>
      );
    };

    export default BottomNavigation
