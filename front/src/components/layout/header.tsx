'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useUser } from '@/lib/mock-auth';
import {
  IconBell,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconUserCircle
} from '@tabler/icons-react';
import { SignOutButton } from '@/lib/mock-auth';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { useCurrentPage } from '@/hooks/use-current-page';

function Header() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => setIsMounted(true), []);
  const { user } = useUser();
  const router = useRouter();
  const currentPage = useCurrentPage();

  const IconComponent =
    currentPage?.icon !== undefined ? Icons[currentPage.icon] : Icons.dashboard;

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      {/* Page Title and Icon Section */}
      <div className='flex items-center gap-3 px-4'>
        <div className='flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#191A1E]'>
          <IconComponent className='h-[26px] w-[26px] text-white' />
        </div>
        <h1 className='text-2xl font-bold text-[#FEFEFE]'>
          {currentPage?.title ?? 'Dashboard'}
        </h1>
      </div>

      {/* User Section */}
      <div className='flex items-center gap-2 px-4'>
        {/* User Block moved from sidebar */}
        {isMounted && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 px-3'
              >
                <UserAvatarProfile
                  className='h-8 w-8 rounded-lg'
                  showInfo
                  user={user}
                />
                <IconChevronsDown className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-56 rounded-lg'
              side='bottom'
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='px-1 py-1.5'>
                  <UserAvatarProfile
                    className='h-8 w-8 rounded-lg'
                    showInfo
                    user={user}
                  />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/profile')}
                >
                  <IconUserCircle className='mr-2 h-4 w-4' />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCreditCard className='mr-2 h-4 w-4' />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconBell className='mr-2 h-4 w-4' />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconLogout className='mr-2 h-4 w-4' />
                <SignOutButton redirectUrl='/auth/sign-in' />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export { Header };
export default Header;
