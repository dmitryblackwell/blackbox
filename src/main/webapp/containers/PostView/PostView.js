import React from 'react';
import Typography from "@material-ui/core/Typography";

import axios from "../../utils/axios";
import MarkDown from "../../components/ui/MarkDown/MarkDown";
import Loader from "../../components/ui/Loader/Loader";

class PostView extends React.Component {
    state = {};

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get("/article/" + id).then(response => {
            this.setState({post: {...response.data}});
        })
    }

    render() {
        if (this.state.post) {
            return (
                <div>
                    <img style={{width: '100%', height: '250px', objectFit: 'cover'}}
                         src={'data:image/png;base64,' + this.state.post.image} alt={this.state.post.title}/>
                    <div style={{maxWidth: '650px', margin: 'auto', minHeight: 'calc(100vh - 170px)'}}>
                        <div id="markdown-wrapper">
                            <MarkDown
                                source={this.state.post.content}
                            />
                            <Typography  component="h6" style={{float: 'right'}}>
                                by @{this.state.post.author}
                            </Typography>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{minHeight: 'calc(100vh - 190px)'}}>
                    <Loader/>
                </div>
            );
        }
    }
}

export default PostView;