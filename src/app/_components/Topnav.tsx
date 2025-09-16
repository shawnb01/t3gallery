import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import UploadThingButton from "./UploadThingButton";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between gap-4 border-b p-4 text-xl font-semibold">
      <div className="flex flex-row items-center gap-4">
        <Link href="/">Gallery</Link>
        <SignedIn>
          <Button variant="outline" asChild>
            <Link href="/explore">View Public Gallery</Link>
          </Button>
        </SignedIn>
      </div>

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div className="flex flex-row items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">View My Gallery</Link>
            </Button>
            <UploadThingButton />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
