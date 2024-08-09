"use client";

import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
} from "@nextui-org/react";
import SearchIcon from "./searchicon";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {
  const router = useRouter();

  return (
    <Navbar isBordered>
      <NavbarContent>
        <NavbarBrand className="mr-4">
          <p className="font-bold text-inherit">PANTRY</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </NavbarContent>
    </Navbar>
  );
}