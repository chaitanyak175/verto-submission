import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers";
import { AppSidebar } from "@/components/sidebar";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Employee Management System",
    description:
        "A comprehensive CRUD application for managing employee data with department and salary tracking",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                                <SidebarTrigger className="-ml-1" />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">
                                        Employee Management System
                                    </h2>
                                </div>
                            </header>
                            <main className="flex-1 overflow-y-auto p-4">
                                {children}
                            </main>
                        </SidebarInset>
                    </SidebarProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
