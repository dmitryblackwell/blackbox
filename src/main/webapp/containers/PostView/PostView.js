import React from 'react';
import Typography from "@material-ui/core/Typography";

import axios from "../../utils/axios";
import MarkDown from "../../components/ui/MarkDown/MarkDown";
import Loader from "../../components/ui/Loader/Loader";
import LinearProgress from "@material-ui/core/LinearProgress";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import classes from './PostView.module.css';

class PostView extends React.Component {
    state = {};

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get("/article/" + id)
            .then(response => {
                this.setState({post: {...response.data}});
                this.setVotesPercent();
            });
        const isVoted = window.sessionStorage.getItem(id);
        this.setState({isVoted: isVoted});
    }

    liked = () => {
        this.vote("/article/liked");
    };

    disliked = () => {
        this.vote("/article/disliked");
    };

    vote = (url) => {
        const fb = new FormData();
        fb.append('id', this.state.post.id);
        axios.post(url, fb).then(result => {
            window.sessionStorage.setItem(this.state.post.id, true);
            this.setState({isVoted: true});
            this.setVotesPercent();
        })
    };

    setVotesPercent = () => {
        let votePercent;
        if (this.state.post.totalVotes === 0)
            votePercent = 0;
        else
            votePercent = (this.state.post.liked / this.state.post.totalVotes) * 100;
        this.setState({votePercent: votePercent})
    };

    render() {
        let vote = null;
        if (!this.state.isVoted) {
            vote = (
                <div style={{marginTop: '80px', marginBottom: '170px'}}>
                    <Typography  component="div" style={{float: 'left'}}>
                        Was this article helpful?
                    </Typography>
                    <ButtonGroup size="small" color="secondary" aria-label="small outlined button group" style={{float: 'right'}}>
                        <Button onClick={this.disliked}>No</Button>
                        <Button onClick={this.liked}>Yes</Button>
                    </ButtonGroup>
                </div>
            );
        }

        if (this.state.post) {
            const linerProgress = (
                <Grid container spacing={0}
                      style={{flexGrow: 1, marginTop: '40px'}}
                      direction="row"
                      justify="center"
                      alignItems="center">
                    <Grid item xs={1}
                          justify="center" style={{textAlign: 'center'}}>
                        {this.state.post.liked}
                    </Grid>
                    <Grid item xs={10}
                          justify="center">
                        <LinearProgress variant="determinate" value={this.state.votePercent}  color="secondary" />
                    </Grid>
                    <Grid item xs={1}
                          justify="center" style={{textAlign: 'center'}}>
                        {this.state.post.totalVotes}
                    </Grid>
                </Grid>
            );
            return (
                <div>
                    <img style={{width: '100%', height: '250px', objectFit: 'cover'}}
                         src={'data:image/png;base64,' + this.state.post.image} alt={this.state.post.title}/>
                    <div className={classes.Wrapper}>
                        {linerProgress}
                        <div id="markdown-wrapper">
                            <MarkDown
                                source={this.state.post.content}
                            />
                            <Typography  component="h6" style={{float: 'right'}}>
                                by @{this.state.post.author}
                            </Typography>
                        </div>
                        {vote}
                    </div>
                </div>
            )
        } else {
            return (
                <div className={classes.Loader}>
                    <Loader/>
                </div>
            );
        }
    }
}

export default PostView;