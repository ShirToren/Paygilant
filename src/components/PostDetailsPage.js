import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PostsContext } from "../context/PostsContext";

export default function PostDetailsPage() {
  const { id } = useParams();
  const { posts, fetchPostComments } = useContext(PostsContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);

  // Fetch the post
  useEffect(() => {
    try {
      const postById = posts.find((p) => p.id === Number(id));
      if (postById) {
        setPost(postById);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [id, posts]);

  // Fetch comments
  useEffect(() => {
    const getComments = async () => {
      setLoadingComments(true);
      const comments = await fetchPostComments(id);
      setComments(comments);
      setLoadingComments(false);
    };

    if (post) {
      getComments();
    }
  }, [post, id, fetchPostComments]);

  if (error) return <div className="text-center my-5 text-danger">{error}</div>;

  return (
    <div className="container my-5">
      <Link to="/" className="btn btn-outline-primary mb-4">
        <i className="bi bi-arrow-left"></i> Back to Posts
      </Link>
      {post ? (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-primary">{post.title}</h3>
            <p className="card-text">{post.body}</p>
          </div>
        </div>
      ) : (
        <div className="text-center my-5">Loading post details...</div>
      )}

      <div className="border p-4 rounded shadow-sm bg-light">
        <h4 className="mb-4">Comments</h4>
        {loadingComments ? (
          <div className="text-center">Loading comments...</div>
        ) : comments.length > 0 ? (
          <ul className="list-unstyled">
            {comments.map((comment) => (
              <li key={comment.id} className="mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-dark">{comment.name}</h5>
                    <p className="card-text">{comment.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted">
            No Comments for this post.
          </div>
        )}
      </div>
    </div>
  );
}
