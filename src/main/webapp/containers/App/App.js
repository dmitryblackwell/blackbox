import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import PostsView from '../PostsView/PostsView';
import PostView from '../PostView/PostView';
import Layout from '../../components/nav/Layout'
import AddPost from '../AddPost/AddPost';
import Footer from "../../components/nav/Footer/Footer";
import Error404 from '../errors/Error404';


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
                        <Route path={"/posts/"} component={PostsView} exact/>
                        <Route path={"/posts/:id"} component={PostView} exact/>
                        <Route path={"/add-post"} component={AddPost} exact/>
                        <Route component={Error404} />
                    </Switch>
                    <Footer/>
                </BrowserRouter>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
