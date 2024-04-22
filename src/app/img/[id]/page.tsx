import FullPageImageView from "~/components/full-image-page";

export default function ImgModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(photoId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid ID");

  return (
    <div className="h-full">
      <FullPageImageView id={idAsNumber} />
    </div>
  );
}
