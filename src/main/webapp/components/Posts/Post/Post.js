import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link, Redirect} from "react-router-dom";
import MarkDown from '../../ui/MarkDown/MarkDown';
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles({
    card: {
        maxWidth: 850,
        margin: '20px',
        textDecoration: 'none'
    },
    actionBtn: {
        float: 'right'
    }
});

export default function ImgMediaCard(props) {
    const [redirect, setRedirect] = useState(false);

    let redirectComponent = null;
    if (redirect) {
        redirectComponent = <Redirect to={"/posts/" + props.id} />;
    }
    const classes = useStyles();

    return (
            <Card className={classes.card} onClick={() => setRedirect(true)}>
                {redirectComponent}
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="140"
                        src={'data:image/png;base64,' + props.image}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography style={{textDecoration: 'none'}} gutterBottom variant="h5" component="h2">
                            {props.title}
                        </Typography>
                        <Typography style={{textDecoration: 'none', marginBottom: '20px'}} gutterBottom variant="h6" component="h6">
                            {props.created}
                        </Typography>
                        <div>
                            {props.tags.map(tag => <Chip style={{marginRight: '5px'}} label={tag} />)}
                        </div>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <MarkDown source={props.content.replace("<h1>", "<p>").replace("</h1>", "</p>").substr(0, 300)} />
                            {props.content.length > 300 ? '...' : ''}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    );
}