/**
 * Components
 */
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar.js';
import { Link } from 'react-router-dom';

/**
 * @typedef {object} SidebarLinkItem
 * @property {string} title
 * @property {string} url
 * @property {React.ElementType} Icon
 */

/**
 * @param {SidebarLinkItem} props
 */
export const AppSidebarLink = ({ title, url, Icon }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={url}>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
