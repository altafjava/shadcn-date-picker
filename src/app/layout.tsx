import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadcn Date Picker",
  description:
    "Shadcn Date Picker is a simple and easy-to-use date picker component for React. It is built with Tailwind CSS and Shadcn UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "flex")}>
        <SidebarProvider>
          <main className="flex-1 h-full">
            <SidebarTrigger />
            {children}
            <Toaster
              richColors
              icons={{
                success: "🎉",
                error: "🚨",
                warning: "⚠️",
              }}
            />
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
