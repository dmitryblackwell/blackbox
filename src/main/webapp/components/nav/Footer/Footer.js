import React from 'react';

import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    Footer: {
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2),
        marginTop: theme.spacing(7),
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        bottom: 0
    },
}));
export default function Footer(props) {
    const classes = useStyles();
    return (
        <footer className={classes.Footer}>
            Copyright 2019 BlackBox - All Rights Reserved.
        </footer>
    );
};