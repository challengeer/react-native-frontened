import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { ReactNode } from "react";

interface TextElementProps extends RNTextProps {
    children?: ReactNode
    type?: "primary" | "secondary"
    className?: string
}

export default function Text({ children, type = "primary", className = "", ...props }: TextElementProps) {
    return (
        <RNText 
            className={`${
                !className.match(/\btext-\w+\b/)
                  ? "text-lg"
                  : ""
              } ${
                type === "primary" 
                    ? "text-neutral-900 dark:text-neutral-100" 
                    : "text-neutral-500 dark:text-neutral-400"
            } ${className}`}
            {...props}
        >
            {children}
        </RNText>
    )
}