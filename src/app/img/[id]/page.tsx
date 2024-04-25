import FullPageImageView from "~/components/full-image-page";

export default function ImgModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  return (
    <div className="h-full">
      <FullPageImageView id={photoId} />
    </div>
  );
}
