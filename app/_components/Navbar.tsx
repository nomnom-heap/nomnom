"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import { useAuth } from "../AuthProvider";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import RecipeInputModal from "./RecipeInputModal";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { userId, setUserId } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    setUserId(null);
    window.location.reload();
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Navbar
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
          {userId ? (
            <Link className="text-white" href="/nombot">
              Nombot
            </Link>
          ) : (
            <Link className="text-white" href="/login">
              Nombot
            </Link>
          )}
        </NavbarItem>
        <NavbarItem>
          <Link className="text-white" href="#">
            My Favourites
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-white" href="#">
            My Recipes
          </Link>
        </NavbarItem>

        <NavbarItem>
          <p className="text-white">Not seeing what you like?</p>
        </NavbarItem>
        <NavbarItem>
          <Button className="white" onPress={onOpen}>
            Create Recipe
          </Button>
          <RecipeInputModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </NavbarItem>
        <NavbarItem>
          {userId ? (
            <Button color="primary" onPress={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button as={Link} color="primary" href="/login">
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
