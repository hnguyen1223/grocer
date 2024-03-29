import { Box, Button, Typography } from "@mui/material";
import { useProviderSignIn } from "../../shared/hooks";
import { AuthProviderID } from "../../shared/interfaces";
import { PersonOutline } from "@mui/icons-material";

export default function Welcome() {
  const [googleSignIn] = useProviderSignIn(AuthProviderID.GOOGLE);
  const [gitHubSignIn] = useProviderSignIn(AuthProviderID.GOOGLE);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" sx={{ my: "12px" }}>
        Welcome to Grocer!
      </Typography>
      <p>
        This is a simple app that demonstrates how to use the MUI library with
        React.
      </p>

      <p>
        Please continue with an account to enjoy the full features of the app.
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
      <Button onClick={googleSignIn} variant="outlined" sx={{ width: "210px" }}>
        <PersonOutline width="24px"></PersonOutline>
        &nbsp; Continue as Guest
      </Button>
    </Box>
  );
}
