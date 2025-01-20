import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const URL = "https://jsonplaceholder.typicode.com/posts";
const CACHE_KEY = "posts_cache";
const CACHE_TIMESTAMP_KEY = "posts_cache_timestamp";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

export const PostsContext = createContext();

export const PostsProvider = ({ children, currentLocation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch posts with caching
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cachedPosts = JSON.parse(localStorage.getItem(CACHE_KEY));
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

        // check if cached data exists and is not expired
        if (
          cachedPosts &&
          cachedTimestamp &&
          Date.now() - parseInt(cachedTimestamp, 10) < CACHE_EXPIRATION_TIME
        ) {
          setPosts(cachedPosts);
          setFilteredPosts(cachedPosts);
        } else {
          // tetch fresh data and update cache
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

  // update filtered posts whenever the search input changes
  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    setFilteredPosts(
      posts.filter((post) => post.title.toLowerCase().includes(lowerCaseSearch))
    );
  }, [search, posts]);

  // reset error when the location changes
  useEffect(() => {
    setError(null);
  }, [currentLocation]);

  const addPost = async (title, body) => {
    if (!title || !body) {
      setError("Both title and body are required.");
      return;
    }
    //send a POST request to the API
    try {
      const response = await axios.post(URL, { title, body });
      //create an id value for the new post (the API returns always the same id - 101)
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

  // provide the state and methods to children
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
