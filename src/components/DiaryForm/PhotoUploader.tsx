import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface PhotoUploaderProps {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}

export default function PhotoUploader({ imageUrls, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    onChange([...imageUrls, ...newUrls]);
  };

  const removeAt = (index: number) => {
    const removedUrl = imageUrls[index];
    if (removedUrl.startsWith("blob:")) {
      URL.revokeObjectURL(removedUrl);
    }
    onChange(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-coral bg-coral-light" : "border-mint bg-mint-light",
        ].join(" ")}
      >
        <ImagePlus className="text-gray-500" size={28} />
        <p className="text-sm text-gray-500">
          사진을 클릭하거나 끌어다 놓아주세요
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {imageUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {imageUrls.map((url, i) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
              <img src={url} alt={`업로드 사진 ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="사진 삭제"
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
