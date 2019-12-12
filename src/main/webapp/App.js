import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import PostsView from './containers/PostsView/PostsView';
import PostView from './containers/PostView/PostView';
import Layout from './components/nav/Layout'
import AddPost from './containers/AddPost/AddPost';


const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#4e4e4e",
            main: "#262626",
            dark: "#000000",
            contrastText: "#fff"
        },
        secondary: {
            light: "#ff5b39",
            main: "#d91c0b",
            dark: "#9f0000",
            contrastText: "#ffffff"
        },
        background: {
            default: "#ffffff"
        }

    }
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <BrowserRouter>
                    <Layout/>
                    <Switch>
                        <Route path={"/"} component={PostsView} exact/>
                        <Route path={"/posts/:id"} component={PostView} exact/>
                        <Route path={"/add-post"} component={AddPost} exact/>
                    </Switch>
                </BrowserRouter>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
