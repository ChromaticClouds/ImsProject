/**
 * Components
 */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

/**
 * Assets
 */
import { ChevronDownIcon } from 'lucide-react';

/**
 * @typedef {object} SidebarCollapsibleItem
 * @property {string} title
 * @property {React.ElementType} Icon
 * @property {{ title: string, url?: string }[]} children
 */

/**
 * @param {SidebarCollapsibleItem} props
 */
export const AppSidebarCollapsible = ({ title, Icon, children }) => {
  return (
    <Collapsible className='group/collapsible'>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Icon />
            <span>{title}</span>
            <ChevronDownIcon className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map((item) => (
              <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton asChild={!!item.url}>
                  {item.url ? (
                    <Link to={item.url}>{item.title}</Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
