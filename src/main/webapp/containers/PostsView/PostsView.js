import React, {Component} from 'react';

import Posts from '../../components/Posts/Posts';
import AddButton from "../../components/ui/AddButton";
import axios from '../../utils/axios';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class PostsView extends Component {

    state = {
        posts: [],
        tags: []
    };

    componentDidMount() {
        this.getArticles();
        axios.get("/tag")
            .then(response => {
                console.log(response.data);
                this.setState({tags: response.data});
            })
    }

    sortingHandler = (event, values) => {
        if (values.length === 0) {
            this.getArticles();
            return;
        }
        const postData = {
            pageId: 0,
            tags: values,
        };
        axios.post("/article/tag/", postData)
            .then(response => {
                this.setState({posts: response.data});
            });
    };

    getArticles = () => {
        axios.get("/article", {pageId: 0}).then(response => {
            this.setState({posts: response.data.content});
        });
    };

    render() {
        return (
            <div style={{maxWidth: '650px', margin: '0 auto', paddingTop: '30px'}}>
                <Autocomplete
                    multiple
                    id="fixed-tags"
                    options={this.state.tags}
                    getOptionLabel={option => option.name}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip name={option.name} label={option.name} {...getTagProps({ index })} />
                        ))
                    }
                    onChange={this.sortingHandler}
                    style={{ width: 500, margin: '0 auto' }}
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
                <Posts
                    posts={this.state.posts}/>
                <AddButton />
            </div>
        )
    }
}

export default PostsView;