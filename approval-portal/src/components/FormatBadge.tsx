interface FormatBadgeProps {
  format: string;
}

export default function FormatBadge({ format }: FormatBadgeProps) {
  const formatConfig: Record<string, { bg: string; text: string }> = {
    Carousel: { bg: "bg-purple-100", text: "text-purple-700" },
    Video: { bg: "bg-red-100", text: "text-red-700" },
    Reel: { bg: "bg-pink-100", text: "text-pink-700" },
    "Single Image": { bg: "bg-blue-100", text: "text-blue-700" },
    Thread: { bg: "bg-green-100", text: "text-green-700" },
    Poll: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Story: { bg: "bg-orange-100", text: "text-orange-700" },
  };

  const config = formatConfig[format] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <span
      className={`${config.bg} ${config.text} text-xs font-medium px-2.5 py-1 rounded-full`}
    >
      {format}
    </span>
  );
}
