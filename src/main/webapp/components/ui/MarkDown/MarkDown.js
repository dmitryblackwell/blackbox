import React from 'react';
import ReactMarkdown from "react-markdown";

import './MdStyle.css';

export default function MarkDown(props) {
    return (
        <ReactMarkdown
            source={props.source}
            escapeHtml={false}
        />
    );
}