import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import Nav from "./components/Nav";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { pink, purple } from "@mui/material/colors";
import Home from "./home/Home";
import { StoreProvider, TodoStore } from "./store";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const TodoApp = lazy(() => import("./todo/TodoApp"));
const Login = lazy(() => import("./route-login/Login"));

const store = new TodoStore();

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: purple[500],
          },
          secondary: {
            main: pink[500],
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <CssBaseline />
            <Nav />]
            <Switch>
              <Route exact path="/">
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <Home />
                </Box>
              </Route>
              <Route path="/login">
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <Suspense fallback={<h3>Loading...</h3>}>
                    <Login />
                  </Suspense>
                </Box>
              </Route>
              <Route path="/todos">
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <Suspense fallback={<h3>Loading...</h3>}>
                    <TodoApp />
                  </Suspense>
                </Box>
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </StoreProvider>
    </LocalizationProvider>
  );
};

export default withAuthenticator(App);
