import {
  Theme,
  ThemeOptions,
  createTheme,
  outlinedInputClasses,
} from "@mui/material";

const baseThemeOptions: ThemeOptions = {
  components: {
    MuiTypography: {
      styleOverrides: {
        h2: {
          fontSize: "2rem",
          fontWeight: 600,
        },
        body2: {
          fontSize: "0.85rem",
        },
        subtitle2: {
          fontSize: "0.75rem",
        },
      },
    },

    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: 0,
        },
        root: {
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderWidth: 0,
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "36px",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          overflow: "hidden",
        },
        paperAnchorBottom: {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
      },
    },
  },
};

export const lightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#607D8B",
    },
    secondary: {
      main: "#8BC34A",
      light: "#caec94",
    },
    action: {
      disabledBackground: "rgba(0, 0, 0, 0.1)",
    },
  },
  ...baseThemeOptions,
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#607D8B",
    },
    secondary: {
      main: "#8BC34A",
      light: "#caec94",
    },
  },
  ...baseThemeOptions,
});
