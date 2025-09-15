import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import analyticsServerClient from "./analytics";
import { utapi } from "./uploadthing";

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

  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.image.findFirst({
    where: {
      id: id,
    },
  });

  if (!image) throw new Error("Not found");

  if (image.userId !== user.userId) throw new Error("Unauthorized");

  return image;
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
