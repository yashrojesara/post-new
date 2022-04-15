import { useLocation } from "react-router-dom";

const Post: React.FC = () => {
  const { state } = useLocation();

  return (
    <pre data-testid="post" className="main">
      {JSON.stringify(state, null, 2)}
    </pre>
  );
};

export default Post;
