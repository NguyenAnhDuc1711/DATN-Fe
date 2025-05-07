import { Button, Container, Flex, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { POST_PATH, Route } from "../../Breads-Shared/APIConfig";
import { Constants } from "../../Breads-Shared/Constants";
import PageConstants from "../../Breads-Shared/Constants/PageConstants";
import Survey from "../../components/ListPost/Post/Survey";
import FileMsg from "../../components/Message/RightSide/Conversation/Body/Message/Files";
import PaginationBtn from "../../components/PaginationBtn";
import { GET } from "../../config/API";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IPost } from "../../store/PostSlice";
import { updateSeeMedia } from "../../store/UtilSlice";
import { changePage } from "../../store/UtilSlice/asyncThunk";

const PostsCmsPage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const props = [
    "author",
    "content",
    "media",
    "files",
    "survey",
    "type",
    "status",
    "statistic",
  ];
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstants.ADMIN.POSTS }));
    handleGetPosts();
  }, []);

  const handleGetPosts = async () => {
    try {
      const data: IPost[] | null | undefined = await GET({
        path: Route.POST + POST_PATH.GET_ALL,
        params: {
          filter: { page: PageConstants.ADMIN.POSTS },
          userId: userInfo._id,
        },
      });
      if (!!data) {
        setPosts(data);
      }
    } catch (err) {
      console.error("handleGetPosts: ", err);
    }
  };

  const tableData = posts?.map(
    ({
      _id,
      authorInfo,
      content,
      media,
      files,
      survey,
      type,
      status,
      replies,
      repostNum,
      usersLike,
    }: any) => {
      const statistic = {
        like: usersLike?.length,
        reply: replies?.length,
        repost: repostNum,
      };
      return {
        _id,
        author: authorInfo?.username,
        content,
        media,
        files,
        survey,
        type,
        status,
        statistic,
      };
    }
  );

  // State for search, sorting, pagination, and data
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Filter data based on search term
  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data based on column and direction
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalRows = posts.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSeeMedia = (media, index) => {
    dispatch(
      updateSeeMedia({
        open: true,
        media: media,
        currentMediaIndex: index,
      })
    );
  };

  const convertStatus = (status) => {
    const entries = Object.entries(Constants.POST_STATUS);
    const currentStatusStr = entries.find(([str, num]) => num === status)?.[0];
    return currentStatusStr;
  };

  return (
    <div className="container mt-2">
      <Flex justifyContent={"space-between"} my={2}>
        <h2>Posts CMS</h2>
        <Button
          onClick={() => {
            const newUrl =
              window.location.origin +
              "/" +
              PageConstants.ADMIN.POSTS_VALIDATION;
            history.pushState(null, "", newUrl);
            window.location.reload();
          }}
        >
          Validation
        </Button>
      </Flex>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Table */}
      <table
        className="table table-striped table-bordered"
        style={{
          maxHeight: "50vh",
        }}
      >
        <thead className="thead-dark">
          <tr>
            {props.map((col) => (
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer", textTransform: "capitalize" }}
              >
                {col}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <tr key={row._id}>
                <td style={{ width: "120px" }}>{row.author}</td>
                <td
                  style={{
                    width: "120px",
                  }}
                >
                  {row.content}
                </td>
                <td
                  style={{
                    width: "120px",
                  }}
                >
                  {row.media.length > 0 && (
                    <Container
                      style={{
                        position: "relative",
                        maxWidth: "120px",
                        width: "fit-content",
                        cursor: "absolute",
                      }}
                    >
                      {row.media?.[0]?.type === Constants.MEDIA_TYPE.VIDEO ? (
                        <video
                          src={row.media?.[0]?.url}
                          style={{
                            maxWidth: "100%",
                            objectFit: "cover",
                            maxHeight: "100px",
                          }}
                          onClick={(e) => {
                            handleSeeMedia(row.media, 0);
                            e.stopPropagation();
                          }}
                        />
                      ) : (
                        <Image
                          src={row.media?.[0]?.url}
                          maxWidth={"100%"}
                          objectFit={"cover"}
                          maxHeight={"100px"}
                          cursor={"pointer"}
                          _hover={{
                            opacity: 0.7,
                          }}
                          onClick={(e) => {
                            handleSeeMedia(row.media, 0);
                            e.stopPropagation();
                          }}
                        />
                      )}
                      {row.media.length - 1 > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            color: "white",
                            transform: "translate(-50%, -50%)",
                            cursor: "pointer",
                            zIndex: 0,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          + {row.media.length - 1}
                        </div>
                      )}
                    </Container>
                  )}
                </td>
                <td style={{ width: "200px" }}>
                  <Flex flexDir={"column"} gap={1}>
                    {row.files.map((file) => (
                      <FileMsg file={file} />
                    ))}
                  </Flex>
                </td>
                <td style={{ width: "160px" }}>
                  <Survey post={row} />
                </td>
                <td
                  style={{
                    textTransform: "capitalize",
                    width: "100px",
                  }}
                >
                  {row.type}
                </td>
                <td
                  style={{
                    textTransform: "capitalize",
                    width: "100px",
                  }}
                >
                  {convertStatus(row.status)?.toLowerCase()}
                </td>
                <td
                  style={{
                    width: "100px",
                  }}
                >
                  {Object.entries(row.statistic).map(([key, value]) => (
                    <p
                      style={{
                        margin: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {key} : {value}
                    </p>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={props.length} className="text-center">
                No matching data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <PaginationBtn
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </nav>
      )}
    </div>
  );
};

export default PostsCmsPage;
