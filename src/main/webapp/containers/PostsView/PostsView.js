import React, {Component} from 'react';

import AddButton from "../../components/ui/AddButton";
import axios from '../../utils/axios';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InfiniteScroll from 'react-infinite-scroller';
import Post from "../../components/Posts/Post/Post";
import Loader from "../../components/ui/Loader/Loader";


class PostsView extends Component {

    state = {
        posts: [],
        tags: [],
        currentTags: [],
        hasMoreArticles: true,
        pageStart: -1,
    };

    componentDidMount() {
        axios.get("/tag")
            .then(response => {
                this.setState({tags: response.data});
            })
    }

    sortingHandler = (event, values) => {
        this.setState({currentTags: values, posts: [], hasMoreArticles: true, pageStart: -1});
    };

    loadArticles = (page) => {
        const params = {
            pageId: page,
            tags: this.state.currentTags
        };
        axios.post("/article", params).then(response => {
            let newPosts = [...this.state.posts, ...response.data.content];
            this.setState({
                posts: newPosts,
                hasMoreArticles: page < response.data.totalPages,
            })
        });
    };

    render() {
        let items = this.state.posts.map(post => {
            return <Post key={post.id} {...post}/>;
        });
        return (
            <div style={{maxWidth: '850px', margin: '0 auto', paddingTop: '30px', minHeight: 'calc(100vh - 170px)'}}>
                <Autocomplete
                    multiple
                    id="fixed-tags"
                    options={this.state.tags}
                    getOptionLabel={option => option.name}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip name={option.name} label={option.name} {...getTagProps({index})} />
                        ))
                    }
                    onChange={this.sortingHandler}
                    style={{width: 500, margin: '0 auto'}}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Fixed tag"
                            variant="outlined"
                            placeholder="Favorites"
                            fullWidth
                        />
                    )}
                />
                <InfiniteScroll
                    pageStart={this.state.pageStart}
                    loadMore={this.loadArticles}
                    hasMore={this.state.hasMoreArticles}
                    loader={<Loader key={0} />}
                >
                    {items} {/*This is the content you want to load*/}
                </InfiniteScroll>
                <AddButton/>
            </div>
        )
    }
}

export default PostsView;