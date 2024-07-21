"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  useDisclosure,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/react";
import { useAuth } from "../AuthProvider";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import RecipeInputModal from "./RecipeInputModal";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { userId, setUserId } = useAuth();
  const [viewportWidth, setViewportWidth] = useState(0);

  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    setUserId(null);
    window.location.reload();
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { name: "My Recipes", value: "/recipes" },
    { name: "My Favourites", value: "/favourites" },
    { name: "Nombot", value: "/nombot" },
  ];

  useEffect(() => {
    setViewportWidth(window.innerWidth);
  }, [viewportWidth]);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      position="static"
      isBordered
      className="bg-slate-500"
      maxWidth="full"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-2",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:border-blue-700",
          "data-[active=true]:after:border-2",
        ],
      }}
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden text-white"
      />
      <NavbarBrand>
        <p className="text-2xl">😋</p>
        <p className="font-bold text-white text-xl">
          <Link href="/" className="text-white">
            NOMNOM
          </Link>
        </p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem isActive={pathname === "/nombot" ? true : false}>
          <Link className="text-white" href="/nombot">
            Nombot
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/favourites" ? true : false}>
          <Link className="text-white" href="/favourites">
            My Favourites
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/recipes" ? true : false}>
          <Link className="text-white" href="/recipes">
            My Recipes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <p className="text-white">Not seeing what you like?</p>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarItem>
          <Button className="white text-xs md:text-sm" onPress={onOpen}>
            Create Recipe
          </Button>
          <RecipeInputModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </NavbarItem>
        <NavbarItem>
          {userId ? (
            <Button
              color="primary"
              className="text-xs md:text-sm"
              onPress={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              as={Link}
              className="text-xs md:text-sm"
              color="primary"
              href="/login"
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem key="My Recipes">
          <Link className="w-full" href={menuItems[0].value} size="lg">
            {menuItems[0].name}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="My Favourites">
          <Link className="w-full" href={menuItems[1].value} size="lg">
            {menuItems[1].name}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="Nombot">
          <Link className="w-full" href={menuItems[2].value} size="lg">
            {menuItems[2].name}
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
