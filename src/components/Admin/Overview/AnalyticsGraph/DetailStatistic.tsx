import { Box, Flex, Heading, Progress, Text, VStack } from "@chakra-ui/react";
import { localeMap, localeToCountry } from "./map";

const DetailStatisticTable = ({
  data,
  title = "",
  total = "",
  subTitle = "",
  keyHead = "",
  valHead = "",
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
            <Progress value={21} size="sm" colorScheme="blue" />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default DetailStatisticTable;
