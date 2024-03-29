import { useContext } from "react";
import { UserContext } from "../../core/UserProvider";
import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "./UserAvatar";
import Welcome from "./Welcome";
import UserAIStat from "./UserAIStat";
import { useSignOut } from "../../shared/hooks";
import { auth } from "../../../firebase";
export default function UserInfo() {
  const user = useContext(UserContext);
  const [signOut] = useSignOut(auth);

  return (
    <Box sx={{ padding: "8px", maxWidth: "420px" }}>
      {user ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <UserAvatar size="medium"></UserAvatar>
          <Typography variant="h6" fontWeight={600}>
            {user?.displayName || "Guest"}
          </Typography>
          {user && <Button onClick={signOut}>Sign out</Button>}
          <UserAIStat></UserAIStat>
        </Box>
      ) : (
        <Welcome></Welcome>
      )}
    </Box>
  );
}
