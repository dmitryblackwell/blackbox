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
import ReactMarkdown from "react-markdown";

const useStyles = makeStyles({
    card: {
        maxWidth: 650,
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
                        <Typography style={{textDecoration: 'none'}} gutterBottom variant="h7" component="h7">
                            {props.created}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <ReactMarkdown
                                source={props.content.substring(0, 300)}
                                escapeHtml={false}
                            />
                            {props.content.length > 300 ? '...' : ''}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    );
}