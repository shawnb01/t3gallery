import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { getImage } from "~/server/queries";
import { toggleImagePrivacyAction, deleteImageAction } from "~/server/actions";
import { Button } from "./ui/button";

export default async function FullPageImageView(props: { id: string }) {
  const image = await getImage(props.id);
  const clerk = await clerkClient();
  const uploaderInfo = await clerk.users.getUser(image.userId);

  const currentUserData = await currentUser();
  let isOwner: boolean;
  if (!currentUserData) {
    isOwner = false;
  } else {
    isOwner = currentUserData.id === image.userId;
  }

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
        {isOwner && (
          <div className="p-2">
            Image Privacy: {image.private ? "Private" : "Public"}
          </div>
        )}
        <div className="p-2">
          <div>Image ID:</div>
          <div>{image.id}</div>
        </div>
        <div className="p-2">
          <div>Uploaded By:</div>
          {/* Show "you" if you are the uploader */}
          <div>{isOwner ? "You" : uploaderInfo.fullName}</div>
        </div>
        <div className="p-2">
          <div>Created On:</div>
          <div>{new Date(image.createdAt).toLocaleDateString()}</div>
        </div>
        {isOwner && (
          <div className="p-2">
            <form action={toggleImagePrivacyAction}>
              <input type="hidden" name="imageId" value={image.id} />
              <input type="hidden" name="currentPrivacy" value={image.private.toString()} />
              <Button type="submit" className="m-1">
                Make {image.private ? "Public" : "Private"}
              </Button>
            </form>
            <form action={deleteImageAction}>
              <input type="hidden" name="imageId" value={image.id} />
              <Button type="submit" className="m-1" variant="destructive">
                Delete Image
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
