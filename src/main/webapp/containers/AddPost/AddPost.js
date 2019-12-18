import React from 'react';

import classes from './AddPost.module.css';
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import axios from '../../utils/axios';

import 'regenerator-runtime/runtime';
import {DropzoneArea} from 'material-ui-dropzone'
import {Redirect} from "react-router";
import Typography from "@material-ui/core/Typography";

class AddPost extends React.Component {
    state = {
        title: null,
        author: null,
        tags: [],
        tmpTag: null,
        content: null,
        file: null,
        redirectUrl: null
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
                this.setState({errors: 'Something went wrong'});
            })
    };

    handleFileChange(files) {
        this.setState({file: files[0]});
    }

    render() {
        return (
            <div className={classes.root}>
                {this.state.redirectUrl ? <Redirect to={this.state.redirectUrl} /> : ''}
                <Typography gutterBottom variant="h6" component="h6" style={{color: 'red'}}>
                    {this.state.errors}
                </Typography>
                <TextField
                    value={this.state.title}
                    onChange={this.onChangeHandler}
                    required
                    name="title"
                    label="Tittle"
                    className={classes.textField}
                    margin="normal"
                />
                <TextField
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
                <div style={{marginTop: '20px', marginBottom: '20px'}}>
                    {this.state.tags.map(tag => {
                        return <Chip style={{marginRight: '5px'}} key={tag} label={tag} onDelete={() => this.handleDelete(tag)} color="primary" />;
                    })}
                </div>
                <DropzoneArea
                    onChange={this.handleFileChange.bind(this)}
                    filesLimit={1}
                    acceptedFiles={['image/*']}
                />
                <TextareaAutosize
                    value={this.state.content}
                    onChange={this.onChangeHandler}
                    name="content"
                    className={classes.textField}
                    aria-label="minimum height"
                    rows={10}
                    placeholder="Content" />
                <Button variant="contained" color="primary" onClick={this.submit} className={classes.button}>
                    Save
                </Button>
            </div>
        );
    }
}

export default AddPost;