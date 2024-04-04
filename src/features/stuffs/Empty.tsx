import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { isDesktop } from "react-device-detect";
import { CreateModalTogglerContext } from "../../core/CreateStuffProvider";

const DESKTOP_LOGO_SIZE = "128px";
const MOBILE_LOGO_SIZE = "72px";
export default function Empty() {
  const setIsModalShown = useContext(CreateModalTogglerContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <img
        src="/empty.svg"
        width={isDesktop ? DESKTOP_LOGO_SIZE : MOBILE_LOGO_SIZE}
      />
      <Typography variant="h3" sx={{ mt: 4, mb: 1 }}>
        It's lonely in here
      </Typography>
      <Typography variant="subtitle1" fontSize="1.2rem" textAlign="center">
        Time for a trip to the grocery store and some ice cream 🍦
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 1 }}
        onClick={() => setIsModalShown(true)}
        size={isDesktop ? "large" : "medium"}
      >
        Add items
      </Button>
    </Box>
  );
}
