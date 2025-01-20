import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const URL = "https://jsonplaceholder.typicode.com/posts";
const CACHE_KEY = "posts_cache";
const CACHE_TIMESTAMP_KEY = "posts_cache_timestamp";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

// Create the context
export const PostsContext = createContext();

// Create the provider component
export const PostsProvider = ({ children, currentLocation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts with caching
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cachedPosts = JSON.parse(localStorage.getItem(CACHE_KEY));
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

        // Check if cached data exists and is not expired
        if (
          cachedPosts &&
          cachedTimestamp &&
          Date.now() - parseInt(cachedTimestamp, 10) < CACHE_EXPIRATION_TIME
        ) {
          setPosts(cachedPosts);
          setFilteredPosts(cachedPosts);
        } else {
          // Fetch fresh data and update cache
          const response = await axios.get(URL);
          if (response?.data) {
            setPosts(response.data);
            setFilteredPosts(response.data);

            localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
          }
        }
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Update filtered posts whenever the search input changes
  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    setFilteredPosts(
      posts.filter((post) => post.title.toLowerCase().includes(lowerCaseSearch))
    );
  }, [search, posts]);

  const addPost = async (title, body) => {
    if (!title || !body) {
      setError("Both title and body are required.");
      return;
    }

    try {
      const response = await axios.post(URL, { title, body });
      const maxId =
        posts.length > 0 ? Math.max(...posts.map((post) => post.id)) : 0;
      const newPost = { ...response?.data, id: maxId + 1 };

      if (newPost) {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setFilteredPosts((prevPosts) => [newPost, ...prevPosts]);

        // Update cache
        const updatedPosts = [newPost, ...posts];
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedPosts));
      }

      return true;
    } catch (err) {
      setError(`Failed to add the post: ${err.message}`);
    }
    return false;
  };

  //   Reset error when navigating
  // Reset error when the location changes
  useEffect(() => {
    setError(null);
  }, [currentLocation]);

  const fetchPostComments = async (id) => {
    try {
      const commentsResponse = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}/comments`
      );
      return commentsResponse.data;
    } catch (error) {
      setError(`Error in fetching comments: ${error.message}`);
    }
  };

  // Provide the state and methods to children
  return (
    <PostsContext.Provider
      value={{
        posts,
        filteredPosts,
        search,
        loading,
        error,
        setSearch,
        addPost,
        fetchPostComments,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
