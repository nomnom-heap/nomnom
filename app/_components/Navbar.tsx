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

export default function NavBar() {
  const { userId, setUserId } = useAuth();

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
