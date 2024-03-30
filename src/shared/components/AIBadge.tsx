import { AutoAwesome } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { ReactNode } from "react";
import SvgGradient from "./SvgGradient";

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
          <SvgGradient></SvgGradient>
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
