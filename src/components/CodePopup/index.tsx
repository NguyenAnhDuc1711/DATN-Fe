import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CodePopup = ({
  isOpen,
  title,
  description,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onSubmit: (code: string) => void;
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={"320px"} borderRadius={"10px"}>
        <ModalBody
          pb={6}
          bg={useColorModeValue("white", "gray.dark")}
          border={`1px solid ${useColorModeValue("gray.dark", "white")}`}
          borderRadius={6}
        >
          <Flex flexDir={"column"}>
            <Text textAlign={"center"} fontWeight={600} fontSize={18} py={3}>
              {title}
            </Text>
            <Text fontSize={14}>{description}</Text>
            <Input
              placeholder="Type your code here ..."
              my={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={() => onSubmit(code)}>{t("submit")}</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CodePopup;
