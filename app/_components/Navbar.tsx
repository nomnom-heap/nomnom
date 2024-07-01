"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { signOut } from "aws-amplify/auth";
import Link from "next/link";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

export default function NavBar() {
  // const { accessToken } = useAuth();
  const router = useRouter();

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
        {/* <NavbarItem>
          {accessToken ? (
            <Button
              color="primary"
              onPress={async (e) => {
                await signOut();
                // window.location.reload();
              }}
            >
              Logout
            </Button>
          ) : (
            <Button color="primary" onPress={() => router.push("/login")}>
              Login
            </Button>
          )}
        </NavbarItem> */}
      </NavbarContent>
    </Navbar>
  );
}
