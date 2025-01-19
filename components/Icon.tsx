import { useColorScheme } from "nativewind";
import { Pressable, PressableProps } from "react-native";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth: number;
  [key: string]: any;
}

export interface ThemedIconProps extends PressableProps {
  className?: string;
  lightColor?: string;
  darkColor?: string;
  strokeWidth?: number;
  icon: React.ComponentType<IconProps>;
}

export default function Icon({
  className = "",
  lightColor = "#171717", // text-neutral-500
  darkColor = "#f5f5f5",  // dark:text-neutral-400
  strokeWidth = 2,
  ...props
}: ThemedIconProps) {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === "dark" ? darkColor : lightColor;

  return (
    <Pressable className={className} {...props}>
      <props.icon color={color} strokeWidth={strokeWidth} />
    </Pressable>
  );
} 