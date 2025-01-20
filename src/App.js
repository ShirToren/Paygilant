import "./App.css";
import PostsPage from "./components/PostsPage";
import PostDetailsPage from "./components/PostDetailsPage";
import AddPost from "./components/AddPost";
import "./css/global.css";
import { PostsProvider } from "./context/PostsContext";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

const AppWrapper = () => {
  const location = useLocation();

  return (
    <PostsProvider currentLocation={location}>
      <Routes>
        <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/posts/*" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailsPage />} />
        <Route path="/add-post" element={<AddPost />} />
      </Routes>
    </PostsProvider>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
