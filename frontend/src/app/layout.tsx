import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/index.css";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MockCred",
  description: "Topmate alternative for mock interviews!",
  openGraph: {
    title: "MockCred | Practice mock interviews and build proof of work!",
    description:
      "Topmate alternative for mock interviews! Practice mock interviews and build proof of work!",
    url: "https://mock-cred.vercel.app/",
    images: [
      {
        url: "https://mock-cred.vercel.app/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "MockCred Preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </StoreProvider>
    </html>
  );
}
