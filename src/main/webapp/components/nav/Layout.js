import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: theme.palette.secondary.main,
    },
    title: {
        flexGrow: 1,
        textAlign: 'left',
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Link to={"/posts/"}>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <HomeTwoToneIcon />
                            {/*<img src="/logo.png" style={{width: '30px'}}/>*/}
                        </IconButton>
                    </Link>
                    <Typography variant="h6" className={classes.title}>
                        BlackBox
                    </Typography>
                    {/*<Button color="inherit">Login</Button>*/}
                </Toolbar>
            </AppBar>
        </div>
    );
}