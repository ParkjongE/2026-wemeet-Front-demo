interface ExampleRecordCardProps {
  imageSrc: string;
  dateLabel: string;
  text: string;
}

export default function ExampleRecordCard({ imageSrc, dateLabel, text }: ExampleRecordCardProps) {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl bg-white shadow-md">
      <img src={imageSrc} alt="" loading="lazy" className="h-40 w-full object-cover" />
      <div className="p-4">
        <p className="text-xs font-medium text-mint-deep">{dateLabel}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-brown">{text}</p>
      </div>
    </div>
  );
}
