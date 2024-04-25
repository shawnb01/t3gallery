import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTFiles, UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { ratelimit } from "~/server/ratelimit";
import { generateId, sluggify } from "~/utils/helpers";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async ({ req, files }) => {
      const user = auth();
      if (!user.userId) throw new UploadThingError("Unauthorized");

      const fullUserData = await clerkClient.users.getUser(user.userId);

      if (fullUserData.privateMetadata?.["can-upload"] !== true)
        throw new UploadThingError(
          "User does not have permission to upload images",
        );

      const { success } = await ratelimit.limit(user.userId);

      if (!success) {
        throw new UploadThingError("Rate limited");
      }

      const fileOverrides = files.map((file) => {
        // const newName = sluggify(file.name);
        const myIdentifier = generateId();
        return { ...file, /*name: newName,*/ customId: myIdentifier };
      });

      return { userId: user.userId, [UTFiles]: fileOverrides };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      if (!file.customId) throw new Error("No customId found on file");

      await db.insert(images).values({
        id: file.customId,
        name: file.name,
        url: file.url,
        userId: metadata.userId,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
