import { Box, Typography } from "@mui/material";

export default function Heading({
  show,
  title,
  subtitle,
  size = "large",
}: {
  show?: boolean;
  title?: string;
  subtitle?: string;
  size?: "small" | "large";
}) {
  return (
    <Box
      sx={{
        opacity: show ? 1 : 0,
        transition: "opacity ease 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant={size === "large" ? "h4" : "h5"}>{title}</Typography>
      <Typography variant={size === "large" ? "subtitle1" : "subtitle2"}>
        {subtitle}
      </Typography>
    </Box>
  );
}
