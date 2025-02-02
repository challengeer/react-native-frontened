import { useColorScheme } from "nativewind";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth: number;
  [key: string]: any;
}

export interface ThemedIconProps {
  lightColor?: string;
  darkColor?: string;
  strokeWidth?: number;
  size?: number;
  onPress?: () => void;
  icon: React.ComponentType<IconProps>;
}

export default function Icon({
  lightColor = "#171717",
  darkColor = "#f5f5f5",
  strokeWidth = 2,
  size = 24,
  onPress,
  ...props
}: ThemedIconProps) {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === "dark" ? darkColor : lightColor;

  return (
    <props.icon color={color} strokeWidth={strokeWidth} size={size} onPress={onPress} {...props} />
  );
} 