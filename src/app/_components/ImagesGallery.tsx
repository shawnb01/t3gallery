import Link from "next/link";
import Image from "next/image";
import { getAllImages, getMyImages } from "~/server/queries";

export default async function ImageGallery(props: { view: "public" | "my" }) {
  const images =
    props.view === "public" ? await getAllImages() : await getMyImages();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {images.map((image) => (
        <div className="flex h-48 w-48 flex-col overflow-scroll" key={image.id}>
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
