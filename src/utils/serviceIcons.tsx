import {
  BookOpen,
  Briefcase,
  Compass,
  Globe,
  GraduationCap,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICON_OPTIONS = [
  { value: "compass", label: "Compass" },
  { value: "book-open", label: "Book" },
  { value: "users", label: "Users" },
  { value: "globe", label: "Globe" },
  { value: "graduation-cap", label: "Graduation cap" },
  { value: "languages", label: "Languages" },
  { value: "map-pin", label: "Map pin" },
  { value: "message-circle", label: "Message" },
  { value: "phone", label: "Phone" },
  { value: "star", label: "Star" },
  { value: "briefcase", label: "Briefcase" },
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_OPTIONS)[number]["value"];

const ICON_MAP: Record<ServiceIconName, LucideIcon> = {
  compass: Compass,
  "book-open": BookOpen,
  users: Users,
  globe: Globe,
  "graduation-cap": GraduationCap,
  languages: Languages,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  phone: Phone,
  star: Star,
  briefcase: Briefcase,
};

const DEFAULT_SERVICE_ICONS: ServiceIconName[] = ["compass", "book-open", "users"];

export function normalizeServiceIcon(icon: string | undefined, index = 0): ServiceIconName {
  if (icon && icon in ICON_MAP) {
    return icon as ServiceIconName;
  }
  return DEFAULT_SERVICE_ICONS[index % DEFAULT_SERVICE_ICONS.length];
}

export function ServiceIcon({
  name,
  size = 24,
  className,
}: {
  name: string | undefined;
  size?: number;
  className?: string;
}) {
  const resolved = normalizeServiceIcon(name);
  const Icon = ICON_MAP[resolved];
  return <Icon size={size} className={className} />;
}
