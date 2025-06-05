import {
  Box,
  Flex,
  Heading,
  Progress,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { localeMap, localeToCountry } from "./map";

const DetailStatisticTable = ({
  data,
  title = "",
  total = "",
  subTitle = "",
  keyHead = "",
  valHead = "",
  isLoading = false,
}) => {
  const countries = {
    "United States": 21,
    India: 9,
    Canada: 3,
    Egypt: 2,
    Germany: 2,
  };
  if (!data) {
    data = countries;
  }

  if (isLoading) {
    return (
      <Box
        width="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        maxHeight={"100%"}
        overflowY={"auto"}
      >
        <Skeleton height="24px" width="70%" mb={2} />
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Skeleton height="20px" width="50%" mb={4} />
          <Skeleton height="20px" width="30%" mb={4} />
        </Flex>

        <VStack spacing={2} align="stretch">
          {[1, 2, 3, 4].map((item) => (
            <Box key={item}>
              <Flex
                alignItems={"center"}
                justifyContent={"space-between"}
                mb={1}
              >
                <Skeleton height="16px" width="40%" />
                <Skeleton height="16px" width="15%" />
              </Flex>
              <Skeleton height="8px" width="100%" />
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  const sumValue: any = Object.values(data).reduce(
    (accumulator: any, currentValue: any) => accumulator + currentValue,
    0
  );

  return (
    <Box width="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Heading size="md" mb={1}>
        {title}
      </Heading>
      {total && (
        <Text fontSize="xl" fontWeight="bold">
          {total}
        </Text>
      )}
      <Text fontSize="lg" fontWeight="semibold">
        {subTitle}
      </Text>
      <VStack spacing={2} align="stretch">
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="medium" fontWeight="semibold">
            {keyHead}
          </Text>
          <Text fontSize="medium" fontWeight="semibold">
            {valHead}
          </Text>
        </Flex>
        {Object.keys(data).map((key) => (
          <Box key={key}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Text fontWeight="semibold">
                {key in localeMap ? localeToCountry(key) : key}
              </Text>
              <Text>{data[key]}</Text>
            </Flex>
            <Progress
              value={Math.floor((data[key] / sumValue) * 100) ?? 0}
              size="sm"
              colorScheme="blue"
              mt={1}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default DetailStatisticTable;
