import { Link } from "react-router-dom";

export default function Post(props) {
  return (
    <div className="card mb-3 shadow-sm post-card">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{props.title}</h5>
        <p className="card-text post-body">{props.body}</p>
        <div className="mt-auto text-center">
          <Link to={`/posts/${props.id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
