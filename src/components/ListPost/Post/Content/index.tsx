import {
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { IPost } from "../../../../store/PostSlice";
import { UserInfoBox } from "../../../UserInfoPopover";

const PostContent = ({ post, content }: { post: IPost; content: string }) => {
  const tagInfo = post.usersTagInfo || [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const usernameRegex = /@[\w.]+/;
  const contentArr = content
    ?.split(/(https?:\/\/[^\s]+|@[\w.]+)/g)
    ?.filter((part) => !!part.trim());

  return (
    <>
      {contentArr?.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <span
              key={index}
              style={{ marginRight: "4px" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link
                href={part}
                color="blue.500"
                isExternal
                _hover={{ textDecoration: "underline" }}
                _focus={{ boxShadow: "none" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {part}
              </Link>
            </span>
          );
        } else if (part.match(usernameRegex)) {
          const matchedUser = tagInfo.find(
            (user) => `@${user.username}` === part
          );
          return (
            <Popover trigger="hover" placement="bottom-start" key={index}>
              <PopoverTrigger>
                <Link
                  href={matchedUser ? `/users/${matchedUser._id}` : "#"}
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                  _focus={{ boxShadow: "none" }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {part}
                </Link>
              </PopoverTrigger>
              {matchedUser && (
                <PopoverContent
                  top="-1"
                  left="-1"
                  transform="translateX(-50%)"
                  borderRadius={"10px"}
                  zIndex={10000}
                >
                  <UserInfoBox user={matchedUser} />
                </PopoverContent>
              )}
            </Popover>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export default PostContent;
