import { AppBar, Box, Divider, Toolbar, useTheme } from "@mui/material";
import { useCallback, useContext } from "react";
import { HeaderContext } from "./HeaderProvider";
import Heading from "../shared/components/Heading";
import { isDesktop } from "react-device-detect";
import { SetUserModalContext } from "./UserModalProvider";
import UserAvatar from "../features/user/UserAvatar";

export default function Header() {
  const { header, showHeader } = useContext(HeaderContext);
  const setModalOpen = useContext(SetUserModalContext);
  const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
  const theme = useTheme();
  return (
    <AppBar
      position="absolute"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Toolbar variant={isDesktop ? "regular" : "dense"}>
        <div
          id="header-control"
          style={{ position: "absolute", left: 16 }}
        ></div>
        <Box
          sx={{
            flexGrow: 1,
            textAlign: "center",
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(50%)",
            transition: "all cubic-bezier(0.4,0,0.2,1) 0.1s",
            zIndex: -1,
          }}
        >
          <Heading
            show={true}
            title={header?.title}
            subtitle={header?.subtitle}
            size="small"
          ></Heading>
        </Box>
        <Box sx={{ position: "absolute", right: 16 }}>
          <UserAvatar onClick={openModal}></UserAvatar>
        </Box>
      </Toolbar>
      {showHeader && <Divider />}
    </AppBar>
  );
}
