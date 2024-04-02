import { useContext } from "react";
import { UserContext } from "../../core/UserProvider";
import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "./UserAvatar";
import Welcome from "./Welcome";
import { useSignOut } from "../../shared/hooks";
import { auth } from "../../../firebase";
import UserAIStat from "./UserAIStat";
export default function UserInfo({
  onGuestSignIn,
}: {
  onGuestSignIn: () => void;
}) {
  const user = useContext(UserContext);
  const [signOut] = useSignOut(auth);

  return (
    <Box sx={{ padding: "8px", maxWidth: "420px" }}>
      {user ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <UserAvatar size="medium"></UserAvatar>
            <Typography variant="h5">{user?.displayName || "Guest"}</Typography>
            {user && <Button onClick={signOut}>Sign out</Button>}
          </Box>

          <UserAIStat></UserAIStat>
        </Box>
      ) : (
        <Welcome onGuestSignIn={onGuestSignIn}></Welcome>
      )}
    </Box>
  );
}
