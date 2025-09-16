"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import analyticsServerClient from "./analytics";
import { utapi } from "./uploadthing";

export async function toggleImagePrivacyAction(formData: FormData) {
  const imageId = formData.get("imageId") as string;
  const currentPrivacy = formData.get("currentPrivacy") === "true";

  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.image.findFirst({
    where: {
      id: imageId,
    },
  });

  if (!image) throw new Error("Not found");

  if (image.userId !== user.userId) throw new Error("Unauthorized");

  try {
    // Check connection before operation
    await db.$connect();
    
    await db.image.update({
      where: {
        id: imageId,
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
        imageId: imageId,
        newPrivacy: !currentPrivacy,
      },
    });

    revalidatePath(`/img/${imageId}`);
  } catch (error) {
    console.error("Error toggling image privacy:", error);
    
    // If it's a connection error, try to reconnect
    if (error instanceof Error && error.message.includes('connection')) {
      console.log("Attempting to reconnect to database...");
      await db.$disconnect();
      await db.$connect();
    }
    
    throw new Error("Failed to update image privacy: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function deleteImageAction(formData: FormData) {
  const imageId = formData.get("imageId") as string;
  
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.image.findFirst({
    where: {
      id: imageId,
    },
  });

  if (!image) throw new Error("Not found");

  if (image.userId !== user.userId) throw new Error("Unauthorized");

  try {
    await db.image.delete({
      where: {
        id: imageId,
        userId: user.userId,
      },
    });

    await utapi.deleteFiles(image.id, { keyType: "customId" });

    analyticsServerClient.capture({
      distinctId: user.userId,
      event: "delete image",
      properties: {
        imageId: imageId,
      },
    });

    redirect("/");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}
