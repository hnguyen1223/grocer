import { Box, Button, Typography } from "@mui/material";
import { useProviderSignIn } from "../../shared/hooks";
import { AuthProviderID } from "../../shared/interfaces";
import { PersonOutline } from "@mui/icons-material";

export default function Welcome({
  onGuestSignIn,
}: {
  onGuestSignIn: () => void;
}) {
  const [googleSignIn] = useProviderSignIn(AuthProviderID.GOOGLE);
  const [gitHubSignIn] = useProviderSignIn(AuthProviderID.GITHUB);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" sx={{ my: "8px" }}>
        Welcome to Grocer!
      </Typography>
      <p>
        This is a simple app to manage food spoilage with a bit of AI goodness.
      </p>
      <p>
        Please continue with a free account to enjoy the full features of the
        app.
      </p>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          pt: "12px",
        }}
      >
        <Button
          onClick={googleSignIn}
          variant="outlined"
          sx={{ width: "210px" }}
        >
          <img src="/google.svg" width="24px" />
          &nbsp; Continue with Google
        </Button>
        <Button
          onClick={gitHubSignIn}
          variant="outlined"
          sx={{ width: "210px" }}
        >
          <img src="/github.svg" width="24px" />
          &nbsp; Continue with GitHub
        </Button>
      </Box>

      <p>Or continue as guest</p>
      <Button
        onClick={onGuestSignIn}
        variant="outlined"
        sx={{ width: "210px" }}
      >
        <PersonOutline width="24px"></PersonOutline>
        &nbsp; Continue as Guest
      </Button>
    </Box>
  );
}
