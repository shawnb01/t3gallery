import * as crypto from "crypto";

function sluggify(name: string) {
  return (
    crypto.createHash("md5").update(name).digest("hex") +
    name.substring(name.lastIndexOf("."))
  );
}

function generateId() {
  return crypto.randomUUID();
}

export { sluggify, generateId };
