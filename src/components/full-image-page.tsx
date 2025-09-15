import { clerkClient } from "@clerk/nextjs/server";
import { deleteImage, getImage } from "~/server/queries";
import { Button } from "./ui/button";

export default async function FullPageImageView(props: { id: string }) {
  const image = await getImage(props.id);

  const uploaderInfo = await clerkClient.users.getUser(image.userId);

  return (
    <div className="relative flex h-full min-h-0 w-full min-w-0">
      <div className="flex-shrink" style={{ width: "100dvw" }}>
        {/* Make the parent div background-url = image.url
            Below img will have opacity 0 and will match the parent div's size
        */}
        <div
          className="flex h-full flex-col items-center justify-center bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image.url})` }}
        >
          <img src={image.url} className="object-contain opacity-0" />
        </div>
      </div>

      {/* TODO: Add query selector to auto-hide info and pop out button to show/hide the info */}
      <div className="flex w-96 flex-shrink-0 flex-col border-l">
        <div className="border-b p-2 text-center text-lg">{image.name}</div>
        <div className="p-2">
          <div>Image ID:</div>
          <div>{image.id}</div>
        </div>
        <div className="p-2">
          <div>Uploaded By:</div>
          <div>{uploaderInfo.fullName}</div>
        </div>
        <div className="p-2">
          <div>Created On:</div>
          <div>{new Date(image.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="p-2">
          <form
            action={async () => {
              "use server";

              await deleteImage(image.id);
            }}
          >
            <Button variant="destructive">Delete</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
