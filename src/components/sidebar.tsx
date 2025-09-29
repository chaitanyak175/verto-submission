"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Settings } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";

const navigation = [
    {
        name: "Employees",
        href: "/employees",
        icon: Users,
    },
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Departments",
        href: "/departments",
        icon: Building2,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Users className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            Employee MS
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Management System
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="px-4 py-2">
                    <div className="text-xs text-muted-foreground">
                        Employee Management System
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                        Version 1.0.0
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
