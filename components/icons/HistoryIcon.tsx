import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function HistoryIcon(props: any) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.252 6v6h4.5"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.887 5.636A9 8.996 45 0 1 16.75 4.208a9 8.996 45 0 1 4.194 10.123 9 8.996 45 0 1-8.69 6.667 9 8.996 45 0 1-8.693-6.67m2.327-8.692L3.38 8.143M3.363 3.15v5.013m0 0h5.013"
      />
    </Svg>
  );
} 