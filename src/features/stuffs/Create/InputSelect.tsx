import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { Image, Keyboard } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../../../core/UserProvider";
import { SetUserModalContext } from "../../../core/UserModalProvider";

export enum InputMethod {
  TEXT = "text",
  IMAGE = "image",
}

export default function InputSelect({
  onClick,
}: {
  onClick: (method: InputMethod) => void;
}) {
  const user = useContext(UserContext);
  const setUserModalOpen = useContext(SetUserModalContext);
  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Add new item
      </Typography>
      <Stack
        direction="row"
        useFlexGap
        columnGap={2}
        justifyContent="center"
        sx={{
          width: isDesktop ? "auto" : "100%",
          mt: 3,
        }}
      >
        <Button
          startIcon={<Keyboard />}
          variant="outlined"
          size="large"
          sx={{ width: 148 }}
          onClick={() => onClick(InputMethod.TEXT)}
          className="gradient-light"
        >
          Manual
        </Button>
        <Button
          disabled={!user}
          startIcon={<Image />}
          variant="outlined"
          size="large"
          sx={{ width: 148 }}
          onClick={() => onClick(InputMethod.IMAGE)}
          className="gradient-light"
        >
          Image
        </Button>
      </Stack>
      {!user && (
        <Box
          sx={{
            display: "flex",
            mt: 2,
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <Typography variant="subtitle2">
            Image recognition available with a free account!
          </Typography>
          <Link
            variant="subtitle2"
            component="button"
            onClick={() => setUserModalOpen(true)}
          >
            Continue
          </Link>
        </Box>
      )}
    </>
  );
}
