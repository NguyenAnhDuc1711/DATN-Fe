import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { TbLibraryPhoto } from "react-icons/tb";
import { Constants } from "../../Breads-Shared/Constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import useDebounce from "../../hooks/useDebounce";
import { AppState } from "../../store";
import { openPopup, updateReportInfo } from "../../store/ReportSlice";
import { convertToBase64 } from "../../util";
import TextArea from "../../util/TextArea";
import ReportMediaDisplay from "./media";
import { sendReport } from "../../store/ReportSlice/asyncThunk";
import { useTranslation } from "react-i18next";

const ReportPopup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const openReportPopup = useAppSelector(
    (state: AppState) => state.report.openPopup
  );
  const reportInfo = useAppSelector(
    (state: AppState) => state.report.reportInfo
  );
  const containMedia = reportInfo.media?.length > 0;

  const imageRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const popupContent = useDebounce(text);

  useEffect(() => {
    dispatch(
      updateReportInfo({
        key: "content",
        value: popupContent,
      })
    );
  }, [popupContent]);

  const handleAddMedia = async (files: any) => {
    const mediaArray = await Promise.all(
      Array.from(files).map(async (file: any) => {
        const base64 = await convertToBase64(file);
        return {
          url: base64,
          type: file.type.includes("image")
            ? Constants.MEDIA_TYPE.IMAGE
            : Constants.MEDIA_TYPE.VIDEO,
        };
      })
    );
    // addEvent({
    //   event: "add_post_media",
    //   payload: {},
    // });
    dispatch(
      updateReportInfo({
        key: "media",
        value: mediaArray,
      })
    );
  };

  const handleSubmitReport = () => {
    dispatch(
      sendReport({
        userId: userInfo?._id,
        content: reportInfo.content,
        media: reportInfo.media,
      })
    );
    dispatch(openPopup());
  };

  return (
    <Modal
      closeOnOverlayClick={true}
      isOpen={openReportPopup}
      onClose={() => dispatch(openPopup())}
    >
      <ModalOverlay />
      <ModalContent w={"400px"} borderRadius={"10px"}>
        <ModalBody pb={6}>
          <Flex flexDir={"column"} gap={3} maxH={"60vh"}>
            <Text textAlign={"center"}>{t("report_issue")}</Text>
            <TextArea
              text={text}
              setText={setText}
              placeholder={t("describe_issue")}
            />
            {!containMedia ? (
              <>
                <Input
                  type="file"
                  multiple
                  hidden
                  ref={imageRef}
                  onChange={(e) => {
                    handleAddMedia(e.target.files);
                  }}
                />
                <TbLibraryPhoto
                  cursor={"pointer"}
                  onClick={() => imageRef.current?.click()}
                />
              </>
            ) : (
              <ReportMediaDisplay />
            )}
          </Flex>
          <Button float={"right"} onClick={() => handleSubmitReport()}>
            {t("submit")}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReportPopup;
