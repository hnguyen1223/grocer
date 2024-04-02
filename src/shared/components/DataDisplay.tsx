import { Box, Typography } from "@mui/material";

export default function DataDisplay({
  label,
  data,
}: {
  label: string;
  data: string | number;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="body1" fontWeight={600} noWrap>
        {label}
      </Typography>
      <Typography noWrap>{data}</Typography>
    </Box>
  );
}
