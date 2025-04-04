import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { useAppDispatch } from "../../hooks/redux";
import Login from "../../pages/Login";
import { openLoginPopupAction } from "../../store/UtilSlice";

const LoginPopupScreen = () => {
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(openLoginPopupAction());
  };

  return (
    <Modal closeOnOverlayClick={true} isOpen={true} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent
        borderRadius={"10px"}
        maxW={"100vw"}
        w={"100vw"}
        p={0}
        m={0}
        bg="transparent"
        onClick={() => {
          onClose();
        }}
      >
        <ModalBody p={0} maxH={"100vh"} maxW={"100vw"} bg="transparent">
          <Login />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginPopupScreen;
