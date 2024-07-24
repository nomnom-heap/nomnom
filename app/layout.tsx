import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Providers } from "./providers";
import Navbar from "@/_components/Navbar";
import { AuthProvider } from "./AuthProvider";
import { ApolloClientProvider } from "./ApolloClientProvider";
import { NextUiWrapperProvider } from "./NextUiWrapperProvider";
import { AmplifyProvider } from "./AmplifyProvider";
import { Toaster } from "react-hot-toast";
import { PostProvider } from "./PostProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nomnom",
  description:
    "Nomnom is a recipe search engine that helps you find the perfect recipe for your next meal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-[100.1vh]`}>
        <AuthProvider>
          <ApolloClientProvider>
            <AmplifyProvider>
              <Navbar />
              <NextUiWrapperProvider>
                <PostProvider>{children}</PostProvider>
              </NextUiWrapperProvider>
              <Toaster />
            </AmplifyProvider>
          </ApolloClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
