"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button, Input, Image } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <SignedOut>
        <div className="py-16 text-center text-3xl">
          Sign in above to view your pantry
        </div>
      </SignedOut>
      <SignedIn>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>
              <UploadButton
                className="py-2"
                endpoint="imageUploader"
                onClientUploadComplete={() => {
                  router.refresh();
                }}
              />
            </TableColumn>
            <TableColumn>
              <Input type="text" label="Enter Product" />
            </TableColumn>
            <TableColumn>
              <Input type="number" label="Enter Quantity" />
            </TableColumn>
            <TableColumn>
              <Button color="primary">Add</Button>
            </TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>
                <Image
                  isZoomed
                  height={50}
                  width={50}
                  alt="NextUI Fruit Image with Zoom"
                  src="https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"
                />
              </TableCell>
              <TableCell>
                <div className="text-xl">Peanut Butter</div>
              </TableCell>
              <TableCell>
                <Input type="number" label="Quantity" />
              </TableCell>
              <TableCell>
                <Button color="secondary">Delete</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SignedIn>
    </div>
  );
}
