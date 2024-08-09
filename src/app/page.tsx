"use client";
import React from 'react';
import Table from './_components/table';
import { trpc } from '../utils/trpc';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export const dynamic = "force-dynamic";

function Page() {
  return (
    <div className='p-4'>
      <SignedIn>
        <Table />
      </SignedIn>
      <SignedOut>
        <div className="w-full h-full text-2xl text-center">Please sign in above</div>
      </SignedOut>
    </div>
  );
};

export default trpc.withTRPC(Page);