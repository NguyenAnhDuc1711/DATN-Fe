import { Flex, PlacementWithLogical, Tooltip } from "@chakra-ui/react";
import { memo } from "react";

const IconWrapper = ({
  label = "",
  icon,
  placement = "top",
  addBg = false,
}: {
  label?: string;
  icon: any;
  placement?: any;
  addBg?: boolean;
}) => {
  const containerStyle = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    padding: "4px",
    cursor: "pointer",
  };

  return (
    <>
      <Tooltip label={label} placement={placement}>
        <Flex
          padding={"2px"}
          margin={0}
          style={containerStyle}
          alignItems={"center"}
          justifyContent={"center"}
          bg={addBg ? "gray" : ""}
          _hover={{
            bg: "gray",
          }}
        >
          {icon}
        </Flex>
      </Tooltip>
    </>
  );
};

export default memo(IconWrapper);
