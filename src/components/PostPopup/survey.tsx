import { Collapse, Container, Flex, Slide, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppState } from "../../store";
import { updatePostInfo } from "../../store/PostSlice";
import SurveyOption from "./survey-option";

const PostSurvey = () => {
  const dispatch = useAppDispatch();
  const postInfo = useAppSelector((state: AppState) => state.post.postInfo);
  const survey = postInfo.survey;
  const [selectedOption, setSelectedOption] = useState(0);

  const handleRemoveSurvey = () => {
    dispatch(
      updatePostInfo({
        ...postInfo,
        survey: [],
      })
    );
  };

  return (
    <Collapse in={true}>
      <Slide direction={"left"} in={true}>
        <Container margin={0} padding={0}>
          {survey.map((item, index) => (
            <SurveyOption
              key={`survey-${item.value}-${index}`}
              option={item}
              index={index}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          ))}
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            margin={"4px 0"}
          >
            <Text fontSize={"13px"} fontWeight={400}>
              End after 24 hours
            </Text>
            <Text
              fontSize={"13px"}
              fontWeight={600}
              cursor={"pointer"}
              onClick={() => handleRemoveSurvey()}
            >
              Remove this survey
            </Text>
          </Flex>
        </Container>
      </Slide>
    </Collapse>
  );
};

export default PostSurvey;
