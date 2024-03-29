import { AutoAwesome } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { ReactNode } from "react";

export default function AIBadge({
  children,
  enhanced = true,
}: {
  children: ReactNode;
  enhanced?: boolean;
}) {
  return (
    <Badge
      overlap="rectangular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      badgeContent={
        <>
          <svg width={0} height={0}>
            <linearGradient id="gradient">
              <stop offset={0} stopColor="rgba(255,0,0,1)" />
              <stop offset={1} stopColor="rgba(63,218,216,1)" />
            </linearGradient>
          </svg>
          <AutoAwesome
            sx={{
              fontSize: 20,
              position: "absolute",
              top: 3,
              right: 3,
              fill: enhanced ? "url(#gradient)" : "lightgrey",
            }}
          />
        </>
      }
    >
      {children}
    </Badge>
  );
}
