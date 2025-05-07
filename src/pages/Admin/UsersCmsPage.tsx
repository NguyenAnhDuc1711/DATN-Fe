import { Flex, Container, Image, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { GET } from "../../config/API";
import { Route, USER_PATH } from "../../Breads-Shared/APIConfig";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppState } from "../../store";
import { Constants } from "../../Breads-Shared/Constants";
import { updateUser } from "../../store/UserSlice/asyncThunk";
import PaginationBtn from "../../components/PaginationBtn";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const convertUserStatus = (status: number) => {
  const { ACTIVE, INACTIVE, LOCK, BANNED } = Constants.USER_STATUS;
  switch (status) {
    case ACTIVE:
      return "Active";
    case INACTIVE:
      return "Inactive";
    case LOCK:
      return "Lock";
    case BANNED:
      return "Banned";
    default:
      return "";
  }
};

const UsersCmsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rowsPerPage = 7;
  const props = ["name", "username", "avatar", "status", "action"];
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const [users, setUsers] = useState<any>();
  const [searchValue, setSearchValue] = useState("");
  const debounceSearch = useDebounce(searchValue);
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = useRef(0);
  const totalPages = Math.ceil(totalRows.current / rowsPerPage);

  useEffect(() => {
    handleGetUserByPage(currentPage, searchValue);
  }, [currentPage, debounceSearch]);

  const handleGetUserByPage = async (page: number, searchValue: string) => {
    try {
      const data: any = await GET({
        path: Route.USER + USER_PATH.GET_USERS_WITH_STATUS,
        params: {
          userId: userInfo?._id,
          page,
          limit: rowsPerPage,
          searchValue,
        },
      });
      setUsers(data?.users);
      totalRows.current = data?.count;
    } catch (err) {
      console.error("handleGetUserByPage: ", err);
    }
  };

  const handleUpdateUserStatus = async ({
    userId,
    status,
  }: {
    userId: string;
    status: number;
  }) => {
    try {
      const payload = {
        userId,
        status,
      };
      dispatch(updateUser(payload));
    } catch (err) {
      console.error("handleUpdateUserStatus: ", err);
    }
  };

  return (
    <div className="container">
      <div className="my-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>
      <table
        className="table table-striped table-bordered"
        style={{
          marginBottom: "12px",
        }}
      >
        <thead className="thead-dark">
          <tr>
            {props.map((col) => (
              <th
                // onClick={() => handleSort("id")}
                style={{ cursor: "pointer", textTransform: "capitalize" }}
              >
                {col}
                {/* {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")} */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users?.length > 0 ? (
            users.map((user: any) => (
              <tr key={user?._id}>
                <td>{user?.name}</td>
                <td>{user?.username}</td>
                <td
                  style={{
                    width: "60px",
                  }}
                >
                  <Image
                    src={user?.avatar}
                    maxWidth={"60px"}
                    objectFit={"cover"}
                    maxHeight={"100px"}
                    cursor={"pointer"}
                    _hover={{
                      opacity: 0.7,
                    }}
                  />
                  {/* <img src={user?.avatar} /> */}
                </td>
                <td>
                  <select
                    defaultValue={user?.status}
                    onChange={(e) =>
                      handleUpdateUserStatus({
                        userId: user?._id,
                        status: Number(e.target.value),
                      })
                    }
                    style={{
                      backgroundColor: "white",
                    }}
                  >
                    {Object.values(Constants.USER_STATUS).map(
                      (status: number) => (
                        <option
                          value={status}
                          style={{
                            backgroundColor: "white",
                          }}
                        >
                          {convertUserStatus(status)}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td>
                  <Flex
                    width={"100%"}
                    height={"100%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Button
                      color="black"
                      border={"1px solid black"}
                      onClick={() => {
                        navigate(`/users/${user?._id}`);
                      }}
                    >
                      See detail
                    </Button>
                  </Flex>
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

export default UsersCmsPage;
