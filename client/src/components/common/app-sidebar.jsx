/**
 * Components
 */
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Card className='p-1 flex justify-center border-0 cursor-pointer hover:bg-muted/50'>
          <Link to='/dashboard'>
            <Logo />
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
                  { title: '조직도', url: '/dashboard/users/group' },
                  { title: '사용자 설정', url: '/dashboard/users/setting' },
                ]}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
