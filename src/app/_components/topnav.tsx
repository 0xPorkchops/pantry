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
      <NavbarContent>
        <SignedIn>
            <Input
            classNames={{
                base: "w-full h-10",
                mainWrapper: "h-full w-full",
                input: "text-small w-full",
                inputWrapper:
                "h-full w-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
            />
        </SignedIn>
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