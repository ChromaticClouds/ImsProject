// @ts-check

/**
 * Components
 */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';

import {
  SIDEBAR_ADDITIONAL_ITEMS,
  SIDEBAR_MAIN_ITEMS,
  SIDEBAR_PRODUCT_ITEMS,
} from '@/constants';

import { AppSidebarLink } from '@/components/common/app-sidebar-link.jsx';
import { AppSidebarCollapsible } from '@/components/common/app-sidebar-collapsible';
import { UsersIcon } from 'lucide-react';
import { Logo } from '@/assets/logo.jsx';
import { Card } from '@/components/ui/card.js';
import { Link } from 'react-router-dom';
import { UserMenu } from '@/components/common/user-menu.jsx';

export const AppSidebar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <Card
          className={`flex cursor-pointer not-last:justify-center overflow-hidden hover:bg-muted/50 ${
            isCollapsed ? 'size-8 p-0 rounded items-center justify-center' : 'h-max p-2'
          }`}
        >
          <Link
            to='/dashboard'
            className='flex items-center shrink-0 text-nowrap'
          >
            <Logo
              variant={isCollapsed ? 'icon' : 'default'}
              size={isCollapsed ? 24 : 42}
            />
          </Link>
        </Card>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메인</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_MAIN_ITEMS.map((item) => (
                <AppSidebarLink
                  key={item.title}
                  {...item}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 재고 관리 */}
        <SidebarGroup>
          <SidebarGroupLabel>재고 관리</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_PRODUCT_ITEMS.map((item) => (
                <AppSidebarLink

                  key={item.title}
                  {...item}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 추가 기능 */}
        <SidebarGroup>
          <SidebarGroupLabel>추가 기능</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ADDITIONAL_ITEMS.map((item) => (
                <AppSidebarLink
                  key={item.title}
                  {...item}
                />
              ))}

              <AppSidebarCollapsible
                title='조직도'
                Icon={UsersIcon}
                children={[
                  { title: '조직도', url: '/dashboard/user/group' },
                  { title: '사용자 설정', url: '/dashboard/user/setting' },
                ]}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu isCollapsed={isCollapsed} />
      </SidebarFooter>
    </Sidebar>
  );
};
