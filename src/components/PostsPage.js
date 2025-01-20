import React, { useContext } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Post from "./Post";
import AddPost from "./AddPost";
import { PostsContext } from "../context/PostsContext";

export default function PostsPage() {
  const { filteredPosts, search, setSearch, loading, error } =
    useContext(PostsContext);

  if (loading) return <div className="text-center my-5">Loading posts...</div>;
  if (error) return <div className="text-center my-5 text-danger">{error}</div>;

  return (
    <div className="container">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="d-flex justify-content-between mb-3 mt-4">
                <Link to="/add-post" className="btn btn-success">
                  Add New Post
                </Link>
              </div>

              <div className="text-center mb-4">
                <h1 className="display-4 text-primary font-weight-bold">
                  Posts
                </h1>
              </div>

              <div className="d-flex justify-content-end mb-4">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="form-control w-100 w-md-25"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="row">
                {filteredPosts.map((post) => (
                  <div className="col-md-4" key={post.id}>
                    <Post
                      id={post.id}
                      title={post.title}
                      body={post.body}
                      bodyClass="text-wrap text-break"
                    />
                  </div>
                ))}
                {filteredPosts.length === 0 && (
                  <div className="text-center text-muted">No posts found.</div>
                )}
              </div>
            </>
          }
        />
        <Route path="/add-post" element={<AddPost />} />
      </Routes>
    </div>
  );
}
