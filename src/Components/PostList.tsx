import { useEffect, useRef, useState } from "react";
import { getPosts } from "./service";
import { IPost } from "./types";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import useScrollEvent from "./useScrollEvent";
// import useIntersectionObserver from "./useIntersectionObserver";

const PostList: React.FC = () => {
  const currentPage = useRef<number>(0);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loader, setLoader] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  //This is 2nd way to identify if we reached a bottom or not

  // const ref = useRef<HTMLDivElement | null>(null);
  // const entry = useIntersectionObserver(ref, {});
  // const isVisible = !!entry?.isIntersecting;

  const isScrollBarAtBottom = useScrollEvent();

  useEffect(() => {
    let interval: any;
    if (!isLastPage) {
      fetchPost();
      interval = setInterval(() => {
        fetchPost();
      }, 10000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isLastPage]);

  const fetchPost = async () => {
    setLoader(true);
    const page = currentPage.current;
    currentPage.current += 1;

    try {
      const response = await getPosts(page);
      const data = response.data.hits as IPost[];
      setPosts((prevPosts) => [...prevPosts, ...data]);
      if (response.data.nbPages <= currentPage.current) {
        setIsLastPage(false);
        alert("All Data Fetched");
      }
    } catch (error) {
      setError("Error fetching data");
      console.log("GetPostError", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (isScrollBarAtBottom && posts?.length > 0 && !isLastPage) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollBarAtBottom]);

  const onRowClick = (post: IPost) => {
    navigate("/PostDetail", { state: post });
  };

  return (
    <TableContainer component={Paper}>
      {loader && (
        <CircularProgress
          style={{ position: "fixed", top: "30%", left: "50%" }}
        />
      )}
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          <Table
            data-testid="table"
            className="table"
            aria-label="simple table"
          >
            <TableHead className="head">
              <TableRow>
                <TableCell data-testid="title" align="left">
                  Title
                </TableCell>
                <TableCell data-testid="url" align="left">
                  URL
                </TableCell>
                <TableCell data-testid="created" align="left">
                  Created At
                </TableCell>
                <TableCell data-testid="author" align="left">
                  Author
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post, index) => {
                return (
                  <TableRow
                    data-testid={"row"}
                    className={`${"row"} ${index % 2 === 0 && "rowColor"}`}
                    onClick={() => onRowClick(post)}
                    key={index}
                  >
                    <TableCell style={{ maxWidth: "300px" }} align="left">
                      {post.title}
                    </TableCell>
                    <TableCell style={{ maxWidth: "300px" }} align="left">
                      {post.url}
                    </TableCell>
                    <TableCell align="left">{post.created_at}</TableCell>
                    <TableCell align="left">{post.author}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* <div ref={ref} style={{ visibility: "hidden" }}>
            Last Post
          </div> */}
        </>
      )}
    </TableContainer>
  );
};

export default PostList;
