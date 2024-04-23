import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import UploadThingButton from "./UploadThingButton";

export function TopNav() {
  return (
    <nav className="flex w-full justify-between gap-4 border-b p-4 text-xl font-semibold">
      <div>Gallery</div>

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div className="flex flex-row items-center gap-4">
            <UploadThingButton />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
