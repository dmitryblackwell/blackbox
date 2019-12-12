import React from 'react';
import Typography from "@material-ui/core/Typography";
import axios from "../../utils/axios";

import Divider from "@material-ui/core/Divider";

class PostView extends React.Component {
    state = {};

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get("/article/" + id).then(response => {
            console.log(response.data)
            this.setState({post: {...response.data}});
        })
    }

    render() {
        if (this.state.post) {
            return (
                <div>
                    <img style={{width: '100%', height: '250px', objectFit: 'cover'}}
                         src={'data:image/png;base64,' + this.state.post.image}/>
                    <div style={{maxWidth: '650px', margin: 'auto'}}>

                        <Typography variant="h2" component="h3">
                            {this.state.post.title}
                        </Typography>
                        <Typography variant="h5" component="h6" style={{float: 'right'}}>
                            by @{this.state.post.author}
                        </Typography>
                        <div style={{marginTop: '40px'}}>
                            <Typography component="p">
                                {this.state.post.content}
                            </Typography>
                        </div>
                    </div>
                </div>
            )
        } else return null;
    }
}

export default PostView;