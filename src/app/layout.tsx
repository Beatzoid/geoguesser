"use client";

import { useState, useMemo } from "react";

import { Inter } from "next/font/google";
import "./globals.css";

import AppContext from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [session, setSession] = useState({
        selectedPos: { lat: 0, lng: 0 },
        correctPos: { lat: 0, lng: 0 },
        history: [],
        score: 0,
        index: 0
    });

    const value = useMemo(
        () => ({ session, setSession }),
        [session, setSession]
    );

    return (
        <html lang="en">
            <body className={inter.className}>
                <AppContext.Provider value={value}>
                    {children}
                </AppContext.Provider>
            </body>
        </html>
    );
}
