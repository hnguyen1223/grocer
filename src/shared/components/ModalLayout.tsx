import { Box, Dialog, DialogContent, Drawer } from "@mui/material";
import { ReactNode } from "react";
import { isDesktop } from "react-device-detect";

export default function ModalLayout({
  open,
  keepMounted = true,
  children,
  onClose,
}: {
  open: boolean;
  keepMounted?: boolean;
  children: ReactNode;
  onClose: () => void;
}) {
  return isDesktop ? (
    <Dialog open={open} onClose={onClose} keepMounted={keepMounted}>
      <DialogContent sx={{ py: "36px" }}>{children}</DialogContent>
    </Dialog>
  ) : (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      keepMounted={keepMounted}
      elevation={24}
    >
      <Box sx={{ padding: "24px" }}>{children}</Box>
    </Drawer>
  );
}
