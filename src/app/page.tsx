import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {images.map((image) => (
        <div className="flex h-48 w-48 flex-col overflow-scroll">
          <Link href={`/img/${image.id}`}>
            <Image
              src={image.url}
              style={{
                objectFit: "none",
                objectPosition: "center",
                overflow: "hidden",
                maxHeight: "144px",
                maxWidth: "192px",
              }}
              width={192}
              height={160}
              alt={image.name}
            />
            <div className="bg-red-300 px-2">{image.name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main>
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign-in above
        </div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
