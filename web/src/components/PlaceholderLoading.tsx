import { SVGProps } from "react";

export const PlaceholderLoading = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="150"
      viewBox="0 0 300 150"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="10" y="10" rx="3" ry="3" width="280" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>

      <rect x="10" y="30" rx="3" ry="3" width="180" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="0.2s"
        />
      </rect>
      <rect x="210" y="30" rx="3" ry="3" width="80" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="0.2s"
        />
      </rect>

      <rect x="10" y="50" rx="3" ry="3" width="260" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="0.4s"
        />
      </rect>

      <rect x="10" y="70" rx="3" ry="3" width="140" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="0.6s"
        />
      </rect>

      <rect x="10" y="90" rx="3" ry="3" width="280" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="0.8s"
        />
      </rect>

      <rect x="10" y="110" rx="3" ry="3" width="100" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="1s"
        />
      </rect>
      <rect
        x="130"
        y="110"
        rx="3"
        ry="3"
        width="160"
        height="10"
        fill="#e0e0e0"
      >
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="1s"
        />
      </rect>

      <rect x="10" y="130" rx="3" ry="3" width="200" height="10" fill="#e0e0e0">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="1.2s"
        />
      </rect>
    </svg>
  );
};
