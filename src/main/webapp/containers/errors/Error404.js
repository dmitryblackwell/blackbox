import React, {Component} from 'react';
import Box from '../../assets/box.svg';

import classes from './Error404.module.css';
import {Link} from "react-router-dom";

class Error404 extends Component {
    render() {
        return (
            <div className={classes.Root}>
                <Link to={"/posts/"}>
                    <Box className={classes.Box}/>
                </Link>
            </div>
        )
    }
}
export default Error404;