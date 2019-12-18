import React, {Component} from 'react';
import Post from './Post/Post';


class Posts extends Component {
    render() {
        return (
            <div>
                {this.props.posts.map(post => {
                    return <Post key={post.id} {...post}/>;
                })}
            </div>
        )
    }
}

export default Posts;