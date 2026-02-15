import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Real-Time Polls",
    description: "Create and share real-time polls instantly.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 overflow-x-hidden">
                    {children}
                </main>
            </body>
        </html>
    );
}
