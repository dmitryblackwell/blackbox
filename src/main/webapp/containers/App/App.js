import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import classes from './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import PostsView from '../PostsView/PostsView';
import PostView from '../PostView/PostView';
import Layout from '../../components/nav/Layout'
import AddPost from '../AddPost/AddPost';
import Footer from "../../components/nav/Footer/Footer";


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

        <div className={classes.App}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter>
                    <Layout/>
                    <Switch>
                        <Route path={"/"} component={PostsView} exact/>
                        <Route path={"/posts/:id"} component={PostView} exact/>
                        <Route path={"/add-post"} component={AddPost} exact/>
                    </Switch>
                    <Footer/>
                </BrowserRouter>
            </MuiThemeProvider>
        </div>
    );
}

export default App;
