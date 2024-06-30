"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

import { Providers } from "./providers";

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
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <Navbar
      position="static"
      isBordered
      className="bg-slate-500"
      maxWidth="full"
    >
      <NavbarBrand>
        <p className="text-2xl">😋</p>
        <p className="font-bold text-white text-xl">NOMNOM</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem>
          <Link className="text-white" href="#">
            My Favourites
          </Link>
        </NavbarItem>
        <NavbarItem>
          <p className="text-white">Not seeing what you like?</p>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} className="white" href="/demo">
            Create Recipe
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
