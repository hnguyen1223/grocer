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
        h3: {
          fontSize: "1.9rem",
          fontWeight: 600,
        },
        h4: {
          fontSize: "1.5rem",
          fontWeight: 600,
        },
        h5: {
          fontSize: "1.1rem",
          fontWeight: 600,
        },
        h6: {
          fontSize: "1.1rem",
        },
        body1: {
          fontSize: "1rem",
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
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          justifyContent: "flex-start",
          textTransform: "none",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 0,
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
          // transition: "all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
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
