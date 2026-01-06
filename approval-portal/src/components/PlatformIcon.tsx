interface PlatformIconProps {
  platform: string;
  size?: "sm" | "md" | "lg";
}

export default function PlatformIcon({
  platform,
  size = "md",
}: PlatformIconProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const platformConfig: Record<
    string,
    { bg: string; icon: string; label: string }
  > = {
    Instagram: {
      bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      icon: "IG",
      label: "Instagram",
    },
    Twitter: {
      bg: "bg-black",
      icon: "X",
      label: "Twitter/X",
    },
    Facebook: {
      bg: "bg-blue-600",
      icon: "f",
      label: "Facebook",
    },
  };

  const config = platformConfig[platform] || {
    bg: "bg-gray-400",
    icon: "?",
    label: platform,
  };

  return (
    <div
      className={`${sizeClasses[size]} ${config.bg} rounded-lg flex items-center justify-center text-white font-bold`}
      title={config.label}
    >
      {config.icon}
    </div>
  );
}
