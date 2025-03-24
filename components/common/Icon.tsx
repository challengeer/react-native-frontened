import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth: number;
  [key: string]: any;
}

export interface ThemedIconProps {
  icon: React.ComponentType<IconProps>;
  variant?: "primary" | "secondary";
  lightColor?: string;
  darkColor?: string;
  strokeWidth?: number;
  size?: number;
  onPress?: () => void;
  className?: string;
}

export default function Icon({
  variant = "primary",
  lightColor = variant === "primary" ? "#171717" : "#737373",
  darkColor = variant === "primary" ? "#f5f5f5" : "#a3a3a3",
  strokeWidth = 2,
  size = 24,
  onPress,
  className,
  ...props
}: ThemedIconProps) {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === "dark" ? darkColor : lightColor;

  return (
    <Pressable 
      onPress={onPress} 
      hitSlop={10}
      disabled={!onPress}
      className={className}
    >
      <props.icon color={color} strokeWidth={strokeWidth} size={size} {...props} />
    </Pressable>
  );
} 