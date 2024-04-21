import { getImageById } from "~/server/queries";

export default async function ImgModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const idAsNumber = (id: string) => {
    const num = Number(id);
    if (isNaN(num)) throw new Error("Invalid id");
    return num;
  };

  const image = await getImageById(idAsNumber(photoId));

  return (
    <div>
      <img src={image.url} className="w-96" />
    </div>
  );
}
