import { Button, Stack, Typography } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { Image, Keyboard } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../../../core/UserProvider";

export enum InputMethod {
  TEXT = "text",
  IMAGE = "image",
}

export default function ({
  onClick,
}: {
  onClick: (method: InputMethod) => void;
}) {
  const user = useContext(UserContext);
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
        <Typography variant="subtitle2" sx={{ textAlign: "center", mt: 2 }}>
          Access image recognition with a free account
        </Typography>
      )}
    </>
  );
}
