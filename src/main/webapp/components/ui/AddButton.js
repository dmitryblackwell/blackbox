import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    root: {
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 1
    }
}));

export default function FloatingActionButtons() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Link to={"/add-post"}>
                <Fab color="secondary" aria-label="edit" className={classes.fab}>
                    <AddIcon />
                </Fab>
            </Link>
        </div>
    );
}