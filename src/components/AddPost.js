import React, { useContext, useState } from "react";
import { PostsContext } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { addPost, error } = useContext(PostsContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postAdded = await addPost(title, body);
    if (postAdded) {
      navigate("/");
    }
  };

  const handleBackToPosts = () => {
    navigate("/");
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center mb-4 text-primary">Create a New Post</h1>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="form-label fw-bold text-secondary"
            >
              Post Title
            </label>
            <input
              type="text"
              id="title"
              className="form-control shadow-sm"
              placeholder="Enter your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="form-label fw-bold text-secondary">
              Post Content
            </label>
            <textarea
              id="body"
              className="form-control shadow-sm"
              rows="5"
              placeholder="Write the content of your post..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleBackToPosts}
            >
              <i className="bi bi-arrow-left"></i> Back to Posts
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-plus-lg"></i> Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
