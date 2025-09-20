'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentPage } from '@/hooks/use-current-page';
import { IconChevronRight, IconMenu2, IconPhotoUp } from '@tabler/icons-react';
import Link from 'next/link';
import * as React from 'react';
import { Icons } from '../icons';
import { CompanyLogoSVG } from '../company-logo';
export const company = {
  name: 'Acme Inc',
  logo: IconPhotoUp,
  plan: 'Enterprise'
};

function AppSidebar() {
  const currentPage = useCurrentPage();
  const { isOpen } = useMediaQuery();
  const { toggleSidebar, open } = useSidebar();

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <div className='flex w-full justify-center'>
          <CompanyLogoSVG className='h-12 w-12 flex-shrink-0' />
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarMenu>
            {/* Toggle Menu Item */}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={open ? 'Close Menu' : 'Open Menu'}
                onClick={toggleSidebar}
              >
                <IconMenu2 />
                <span>{open ? 'Close Menu' : 'Open Menu'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {navItems.map((item) => {
              const Icon =
                item.icon !== undefined ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={currentPage?.url === item.url}
                      >
                        {item.icon !== undefined && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={currentPage?.url === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={currentPage?.url === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };
export default AppSidebar;
