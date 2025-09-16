import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import analyticsServerClient from "./analytics";
import { utapi } from "./uploadthing";

export async function getAllImages() {
  const images = await db.image.findMany({
    where: {
      private: false,
    },
    orderBy: {
      id: "asc",
    },
  });
  return images;
}

export async function getMyImages() {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const images = await db.image.findMany({
    where: {
      userId: user.userId,
    },
    orderBy: {
      id: "asc",
    },
  });
  return images;
}

export async function getImage(id: string) {
  const user = auth();
  const image = await db.image.findFirst({
    where: {
      id: id,
    },
  });
  // Check if image exists
  if (!image) throw new Error("Not found");

  // check if the image is public
  if (!image.private) return image;
  // Check if the image is private and if the user is not logged in
  if (!user.userId && image.private) throw new Error("Unauthorized");
  //Check if the user is the owner of the image
  if (image.userId !== user.userId) throw new Error("Unauthorized");

  return image;
}

export async function toggleImagePrivacy(id: string, currentPrivacy: boolean) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.image.findFirst({
    where: {
      id: id,
    },
  });

  if (!image) throw new Error("Not found");

  await db.image.update({
    where: {
      id: id,
      userId: user.userId,
    },
    data: {
      private: !currentPrivacy,
    },
  });

  analyticsServerClient.capture({
    distinctId: user.userId,
    event: "toggle image privacy",
    properties: {
      imageId: id,
      newPrivacy: !currentPrivacy,
    },
  });

  redirect(`/img/${id}`);
}

export async function deleteImage(id: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.image.findFirst({
    where: {
      id: id,
    },
  });

  if (!image) throw new Error("Not found");

  await db.image.delete({
    where: {
      id: id,
      userId: user.userId,
    },
  });

  await utapi.deleteFiles(image.id, { keyType: "customId" });

  analyticsServerClient.capture({
    distinctId: user.userId,
    event: "delete image",
    properties: {
      imageId: id,
    },
  });

  redirect("/");
}
