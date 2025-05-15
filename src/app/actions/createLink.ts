"use server";

import { PrismaClient } from "@/generated/prisma";
import { AES, enc } from "crypto-js";
import { generate } from "generate-password";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.ENCRYPT_KEY;

export const generateLink = async (data: any) => {
  try {
    if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined");

    const originalUrl = JSON.parse(data);
    if (!originalUrl) throw new Error("Invalid URL in request");

    const encryptedLink = AES.encrypt(originalUrl, SECRET_KEY).toString();

    const id = generate({
      length: 10,
      uppercase: true,
      lowercase: true,
      excludeSimilarCharacters: true,
    });

    const newLink = await prisma.link.create({
      data: {
        id,
        link: encryptedLink,
        claimed: false,
        date: new Date(),
      },
    });

    return { data: id };
  } catch (error: any) {
    console.error("generateLink error:", error);
    return { error: error.message };
  }
};

export const getLink = async (id: string) => {
  try {
    if (!id) return { error: "id not found" };
    if (!SECRET_KEY) return { error: "SECRET_KEY is not defined" };

    const res = await prisma.link.findUnique({
      where: { id },
      select: { link: true },
    });

    if (!res || !res.link) return { error: "Link not found" };

    const decrypted = AES.decrypt(res.link, SECRET_KEY);
    const originalUrl = decrypted.toString(enc.Utf8); 

    if (!originalUrl) return { error: "Decryption failed" };
    await prisma.link.update({
      where: { id },
      data: {
        claimed: true,
      },
    });
    return { data: originalUrl };
  } catch (error: any) {
    console.error("getLink error:", error);
    return { error: error.message };
  }
};
