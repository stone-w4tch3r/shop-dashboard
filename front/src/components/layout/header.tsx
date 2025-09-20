'use client';
import React from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import CtaGithub from './cta-github';
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

function Header() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => setIsMounted(true), []);
  const { user } = useUser();
  const router = useRouter();

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        <CtaGithub />
        <div className='hidden md:flex'>
          <SearchInput />
        </div>

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

        <ModeToggle />
      </div>
    </header>
  );
}

export { Header };
export default Header;
