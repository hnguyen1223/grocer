import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { lightTheme } from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StuffsProvider } from "./core/StuffsProvider";
import UserProvider from "./core/UserProvider";
import NavDrawer from "./core/Drawer";
import Header from "./core/Header";
import CreateStuffProvider from "./core/CreateStuffProvider";
import CreateStuff from "./features/stuffs/CreateStuff";
import useIsHorizontal from "./shared/hooks/layout";
import { isDesktop } from "react-device-detect";
import NavBar from "./core/NavBar";
import PathProvider from "./core/PathProvider";

function App() {
  const isHorizontalLayout = isDesktop || useIsHorizontal();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={lightTheme}>
        <PathProvider>
          <UserProvider>
            <StuffsProvider>
              <CreateStuffProvider>
                <CssBaseline />
                {isHorizontalLayout && <NavDrawer />}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Header />
                  <Box
                    sx={{
                      pt: "56px",
                      pb: isHorizontalLayout ? "0" : "52px",
                      px: "12px",
                      height: "100%",
                    }}
                  >
                    <Outlet />
                  </Box>
                  {!isHorizontalLayout && <NavBar></NavBar>}
                </Box>
                <CreateStuff></CreateStuff>
              </CreateStuffProvider>
            </StuffsProvider>
          </UserProvider>
        </PathProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
