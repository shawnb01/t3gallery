import { SignedIn, SignedOut } from "@clerk/nextjs";
import ImageGallery from "./_components/ImagesGallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main>
      <SignedOut>
        <ImageGallery view="public" />
      </SignedOut>
      <SignedIn>
        {/* Create router handler for signed in users to be able to view public (explore) images and their own images */}
        <ImageGallery view="my" />
      </SignedIn>
    </main>
  );
}
