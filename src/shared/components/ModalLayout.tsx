import { Box, Dialog, DialogContent, Drawer } from "@mui/material";
import { ReactNode } from "react";
import { isDesktop } from "react-device-detect";

export default function ModalLayout({
  open,
  children,
  onClose,
}: {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
}) {
  return isDesktop ? (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  ) : (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      keepMounted
      elevation={24}
    >
      <Box sx={{ padding: "24px" }}>{children}</Box>
    </Drawer>
  );
}
