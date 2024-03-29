import { AppBar, Toolbar, Typography } from "@mui/material";
import User from "../features/user/User";
import { useContext } from "react";
import { PathContext } from "./PathProvider";

export default function Header() {
  const path = useContext(PathContext);
  return (
    <AppBar
      position="absolute"
      color="transparent"
      sx={{
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {path}
        </Typography>
        <User></User>
      </Toolbar>
    </AppBar>
  );
}
