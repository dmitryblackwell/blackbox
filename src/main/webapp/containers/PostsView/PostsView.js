import React, {Component} from 'react';

import AddButton from "../../components/ui/AddButton";
import axios from '../../utils/axios';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InfiniteScroll from 'react-infinite-scroller';
import Post from "../../components/Posts/Post/Post";
import {ScaleLoader} from 'react-spinners';
import {css} from '@emotion/core';

class PostsView extends Component {

    state = {
        posts: [],
        tags: [],
        currentTags: [],
        hasMoreArticles: true,
    };

    componentDidMount() {
        axios.get("/tag")
            .then(response => {
                this.setState({tags: response.data});
            })
    }

    sortingHandler = (event, values) => {
        this.setState({currentTags: values, posts: [], hasMoreArticles: true});
    };

    loadArticles = (page) => {
        const params = {
            pageId: page,
            tags: this.state.currentTags
        };
        axios.post("/article", params).then(response => {
            console.log({params: params.params, response: response});
            let newPosts = [...this.state.posts, ...response.data.content];
            this.setState({
                posts: newPosts,
                hasMoreArticles: page < response.data.totalPages,
            })
        });
    };

    render() {
        let loader =
            <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' }} key={0}>
                <ScaleLoader
                    sizeUnit={"px"}
                    size={150}
                    color={'#ff0000'}
                    loading={true}
                />
            </div>;
        let items = this.state.posts.map(post => {
            return <Post key={post.id} {...post}/>;
        });
        return (
            <div style={{maxWidth: '850px', margin: '0 auto', paddingTop: '30px'}}>
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
                    pageStart={-1}
                    loadMore={this.loadArticles}
                    hasMore={this.state.hasMoreArticles}
                    loader={loader}
                >
                    {items} {/*This is the content you want to load*/}
                </InfiniteScroll>
                <AddButton/>
            </div>
        )
    }
}

export default PostsView;