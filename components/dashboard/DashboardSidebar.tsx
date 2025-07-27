import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  Home,
  Layers, MapPin,
  MessageSquare,
  NotebookPenIcon,
  Settings,
  UserCog,
  Users,
} from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType, useState } from "react";
import { Button } from "@/components/ui/button";
import { RolesEnum } from "@/lib/db/enums";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface SubMenuItem {
  title: string;
  href: string;
  requiredPermissions: string[];
  icon: ElementType;
}

interface MenuItem {
  title: string;
  icon: ElementType;
  href?: string;
  requiredRoles: number[];
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Overview",
    icon: Home,
    href: "/dashboard",
    requiredRoles: [RolesEnum.USER, RolesEnum.BUSINESS_ADMIN, RolesEnum.MANAGER],
  },
  {
    title: "Business Management",
    icon: Building2,
    requiredRoles: [RolesEnum.BUSINESS_ADMIN, RolesEnum.MANAGER, RolesEnum.SUPER_ADMIN],
    subItems: [
      {
        title: "Locations",
        href: "/dashboard/business/locations",
        requiredPermissions: ["manage.locations"],
        icon: MapPin,
      },
      {
        title: "Departments",
        href: "/dashboard/business/departments",
        requiredPermissions: ["manage.departments"],
        icon: Layers,
      },
      {
        title: "Business Profile",
        href: "/dashboard/business/profile",
        requiredPermissions: ["manage.business"],
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Feedback Collection",
    icon: MessageSquare,
    requiredRoles: [RolesEnum.BUSINESS_ADMIN, RolesEnum.MANAGER, RolesEnum.SUPER_ADMIN],
    subItems: [
      {
        title: "Requests",
        icon: FileQuestion,
        href: "/dashboard/feedback/requests",
        requiredPermissions: ["manage.templates"],
      },
      {
        title: "Templates",
        icon: NotebookPenIcon,
        href: "/dashboard/feedback/templates",
        requiredPermissions: ["manage.templates"],
      },
      {
        title: "Customers",
        icon: Users,
        href: "/dashboard/feedback/customers",
        requiredPermissions: ["manage.customers"],
      },
    ],
  },

  // {
  //   title: "Analytics",
  //   icon: BarChart3,
  //   requiredRoles: [RolesEnum.SUPER_ADMIN, RolesEnum.MANAGER],
  //   subItems: [
  //     {
  //       title: "Reports",
  //       href: "/dashboard/analytics/reports",
  //       requiredPermissions: ["view_reports"],
  //       icon: FileBarChart2,
  //     },
  //     {
  //       title: "Insights",
  //       href: "/dashboard/analytics/insights",
  //       requiredPermissions: ["view_analytics"],
  //       icon: Activity,
  //     },
  //   ],
  // },
  // {
  //   title: "Projects",
  //   icon: FileText,
  //   requiredRoles: [RolesEnum.USER, RolesEnum.BUSINESS_ADMIN, RolesEnum.MANAGER],
  //   subItems: [
  //     {
  //       title: "All Projects",
  //       href: "/dashboard/projects",
  //       requiredPermissions: ["view_projects"],
  //       icon: Files,
  //     },
  //     {
  //       title: "Create Project",
  //       href: "/dashboard/projects/create",
  //       requiredPermissions: ["create_projects"],
  //       icon: FilePlus2,
  //     },
  //   ],
  // },
  // {
  //   title: "Calendar",
  //   icon: Calendar,
  //   href: "/dashboard/calendar",
  //   requiredRoles: [RolesEnum.USER, RolesEnum.BUSINESS_ADMIN, RolesEnum.MANAGER],
  // },
  {
    title: "Profile",
    icon: UserCog,
    href: "/dashboard/profile",
    requiredRoles: [RolesEnum.USER, RolesEnum.SUPER_ADMIN, RolesEnum.MANAGER],
  },
  {
    title: "Settings",
    icon: Settings,
    href:"/dashboard/business/profile",
    requiredRoles: [RolesEnum.SUPER_ADMIN],
  },
];

const DashboardSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { userRolesPermissions } = useAuthStore();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (subItems: SubMenuItem[]) =>
    subItems.some((item) => pathname.startsWith(item.href));

  const hasRole = (requiredRoles: number[]) => {
    if (!userRolesPermissions) return false;
    return requiredRoles.some((role) =>
      userRolesPermissions.roles.map((x) => x.roleId).includes(role)
    );
  };

  const hasPermission = (requiredPermissions: string[]) => {
    if (!userRolesPermissions) return false;
    return requiredPermissions.some((permission) =>
      userRolesPermissions.rolePermissions
        .map((x) => x.permissionName)
        .includes(permission)
    );
  };

  const getVisibleSubItems = (subItems: SubMenuItem[]) => {
    return subItems.filter((subItem) =>
      hasPermission(subItem.requiredPermissions)
    );
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems
          .filter((item) => hasRole(item.requiredRoles))
          .map((item) => {
            const visibleSubItems = item.subItems
              ? getVisibleSubItems(item.subItems)
              : [];
            const hasVisibleSubItems = visibleSubItems.length > 0;

            return (
              <div key={item.title}>
                {item.href ? (
                  <Link href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive(item.href) &&
                        "bg-primary/10 text-primary hover:text-white"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                ) : (
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between ",
                        hasVisibleSubItems &&
                        isParentActive(visibleSubItems) &&
                        "bg-primary/10 text-primary"
                      )}
                      onClick={() => toggleExpanded(item.title)}
                      disabled={!hasVisibleSubItems}
                    >
                      <div className="flex items-center ">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </div>
                      {hasVisibleSubItems &&
                        (expandedItems.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        ))}
                    </Button>

                    {expandedItems.includes(item.title) &&
                      hasVisibleSubItems && (
                        <div className="ml-6 mt-1 space-y-1">
                          {visibleSubItems.map((subItem) => (
                            <Link key={subItem.href} href={subItem.href}>
                              <Button
                                variant={
                                  isActive(subItem.href) ? "secondary" : "ghost"
                                }
                                size="sm"
                                className={cn(
                                  "w-full justify-start",
                                  isActive(subItem.href) &&
                                  "bg-primary/10 text-primary hover:text-white"
                                )}
                              >
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.title}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
