import React from 'react';
import Typography from "@material-ui/core/Typography";


import axios from "../../utils/axios";
import MarkDown from "../../components/ui/MarkDown/MarkDown";

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
                        <div id="markdown-wrapper">
                            <MarkDown
                                source={this.state.post.content}
                            />
                            <Typography  component="h7" style={{float: 'right'}}>
                                by @{this.state.post.author}
                            </Typography>
                        </div>
                    </div>
                </div>
            )
        } else return null;
    }
}

export default PostView;