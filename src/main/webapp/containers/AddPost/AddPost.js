import React from 'react';

import classes from './AddPost.module.css';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import axios from '../../utils/axios';

import 'regenerator-runtime/runtime';
import {DropzoneArea} from 'material-ui-dropzone'
import {Redirect} from "react-router";

class AddPost extends React.Component {
    state = {
        title: null,
        author: null,
        tags: [],
        tmpTag: null,
        content: null,
        file: null,
        redirectUrl: null,
        errors: [],
    };

    onChangeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name === "tags") {
            name = "tmpTag";
        }
        this.setState({
            [name]: value
        })
    };

    handleDelete = (tag) => {
        let tags = this.state.tags;
        tags = tags.filter(t => t !== tag);
        this.setState({tags: tags});
    };

    onTagSubmit = (event) => {
        if (event.key === "Enter") {
            let newTags = this.state.tags;
            const value = event.target.value;
            const tagName = value.split(' ').join('-').toLowerCase();
            newTags.push(tagName);
            this.setState({tags: newTags, tmpTag: ''});
        }
    };

    submit = () => {
        const postData = {
            title: this.state.title,
            author: this.state.author,
            tags: this.state.tags,
            content: this.state.content
        };
        axios.put("/article", postData)
            .then(response => {
                this.setState({errors: ''});
                const id = response.data.id;
                const fb = new FormData();
                fb.append('file', this.state.file, this.state.file.name);
                fb.append('id', id);
                axios.post("/article/upload", fb)
                    .then(response => {
                        const redirectUrl = "/posts/" + id;
                        this.setState({redirectUrl: redirectUrl});
                    });
            })
            .catch(error => {
                if (error.response.data.errors) {
                    this.setState({errors: error.response.data.errors});
                }
            });
    };

    handleFileChange(files) {
        this.setState({file: files[0]});
    }

    render() {
        return (
            <div className={classes.root}>
                {this.state.redirectUrl ? <Redirect to={this.state.redirectUrl} /> : ''}
                <TextField
                    error={this.state.errors["title"]}
                    helperText={this.state.errors["title"]}
                    value={this.state.title}
                    onChange={this.onChangeHandler}
                    required
                    name="title"
                    label="Tittle"
                    className={classes.textField}
                    margin="normal"
                />
                <TextField
                    error={this.state.errors["author"]}
                    helperText={this.state.errors["author"]}
                    value={this.state.author}
                    onChange={this.onChangeHandler}
                    required
                    name="author"
                    label="Author"
                    className={classes.textField}
                    margin="normal"
                />
                <TextField
                    value={this.state.tmpTag}
                    onChange={this.onChangeHandler}
                    onKeyPress={this.onTagSubmit}
                    required
                    name="tags"
                    label="Tags"
                    className={classes.textField}
                    margin="normal"
                />
                <div className={classes.chips}>
                    {this.state.tags.map(tag => {
                        return <Chip className={classes.chip} key={tag} label={tag} onDelete={() => this.handleDelete(tag)} color="primary" />;
                    })}
                </div>

                <div className={classes.dropzone}>
                    <DropzoneArea
                        onChange={this.handleFileChange.bind(this)}
                        filesLimit={1}
                        acceptedFiles={['image/*']}
                    />
                </div>

                <TextField
                    multiline
                    error={this.state.errors["content"]}
                    helperText={this.state.errors["content"]}
                    value={this.state.content}
                    onChange={this.onChangeHandler}
                    name="content"
                    className={classes.textField}
                    aria-label="minimum height"
                    rows={10}
                    variant="outlined"
                    placeholder="Content" />
                <Button variant="contained" color="primary" onClick={this.submit} className={classes.button}>
                    Save
                </Button>
            </div>
        );
    }
}

export default AddPost;