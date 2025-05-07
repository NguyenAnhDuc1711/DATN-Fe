import {
  Button,
  Container,
  Fade,
  Flex,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import * as marked from "marked";
import { useState } from "react";
import { REPORT_PATH, Route } from "../../../Breads-Shared/APIConfig";
import { POST } from "../../../config/API";
import { useAppSelector } from "../../../hooks/redux";
import { AppState } from "../../../store";
import MediaDisplay from "../../PostPopup/mediaDisplay";
import UserBox from "../../UserFollowBox/UserBox";

const ReportBox = ({
  report,
  selectedReport,
  setSelectedReport,
  reports,
  setReports,
}) => {
  const { colorMode } = useColorMode();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const { content, media, userReport } = report;
  const [res, setRes] = useState("");

  const updateNewList = () => {
    const newReports = reports?.filter(({ _id }) => _id !== report?._id);
    setReports(newReports);
  };

  const handleReject = async () => {
    const payload = {
      userId: userInfo?._id,
      reportId: report?._id,
    };
    await POST({
      path: Route.REPORT + REPORT_PATH.REJECT,
      payload,
    });
    updateNewList();
  };

  const handleSendMail = async () => {
    const htmlConverted = marked.parse(res);
    const payload = {
      from: "mraducky@gmail.com",
      to: "ducna17112003@gmail.com", //report.userReport?.email,
      subject: "Thanks for reporting the problem",
      html: htmlConverted,
      userId: userInfo?._id,
      reportId: report?._id,
    };
    await POST({
      path: Route.REPORT + REPORT_PATH.RESPONSE,
      payload,
    });
    setSelectedReport(null);
    updateNewList();
  };

  const reportContainer = () => {
    return (
      <Container
        height={"fit-content"}
        m={0}
        p={4}
        width={"30vw"}
        border={`1px solid ${colorMode === "dark" ? "#ffffff" : "#202020"}`}
        borderRadius={8}
      >
        <UserBox user={userReport} inFollowBox={true} />
        <Text mt={2}>{content}</Text>
        {!!media && media?.length > 0 && <MediaDisplay media={media} />}
        <Flex gap={3} mt={2}>
          <Button flex={1} onClick={() => handleReject()}>
            Reject
          </Button>
          <Button
            flex={1}
            bg={"green"}
            onClick={() => setSelectedReport(report)}
          >
            Response
          </Button>
        </Flex>
      </Container>
    );
  };

  return (
    <Flex gap={6}>
      {selectedReport?._id === report?._id ? (
        <>
          {reportContainer()}
          <Fade in={true}>
            <Container m={0} p={0} height={"fit-content"}>
              <MDEditor
                value={res}
                onChange={(value) => setRes(value as string)}
                preview="edit"
                height={300}
                style={{ overflow: "hidden" }}
                textareaProps={{
                  placeholder:
                    "Briefly describe your idea and what problem it solves",
                }}
                previewOptions={{
                  disallowedElements: ["style"],
                }}
              />
              <Flex gap={3} mt={2} py={2}>
                <Button flex={1} onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <Button flex={1} bg={"green"} onClick={() => handleSendMail()}>
                  Send mail
                </Button>
              </Flex>
            </Container>
          </Fade>
        </>
      ) : (
        <>{reportContainer()}</>
      )}
    </Flex>
  );
};

export default ReportBox;
