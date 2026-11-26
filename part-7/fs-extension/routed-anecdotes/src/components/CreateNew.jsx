import { useState } from "react";
import { useNavigate } from "react-router";
import { useField } from "../hooks";

const CreateNew = ({ addAnecdote }) => {
    const navigate = useNavigate();
    const { reset: resetContent, ...content } = useField("text");
    const { reset: resetAuthor, ...author } = useField("text");
    const { reset: resetInfo, ...info } = useField("text");

    const handleSubmit = (e) => {
        e.preventDefault();
        addAnecdote({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0,
        });
        navigate("/");
    };

    const resetAllFields = () => {
        resetContent();
        resetAuthor();
        resetInfo();
    };

    return (
        <div>
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content
                    <input {...content} />
                </div>
                <div>
                    author
                    <input {...author} />
                </div>
                <div>
                    url for more info
                    <input {...info} />
                </div>
                <button>create</button>
                <button type="button" onClick={resetAllFields}>
                    reset
                </button>
            </form>
        </div>
    );
};

export default CreateNew;
