import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Route, USER_PATH, UTIL_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { encodedString } from "../Breads-Shared/util";
import { GET, POST } from "../config/API";
import { useAppDispatch } from "../hooks/redux";
import useShowToast from "../hooks/useShowToast";
import { IUser } from "../store/UserSlice";
import { login } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { genRandomCode } from "../util/index";

type LoginInput = {
  email: string;
  password: string;
  loginAsAdmin?: boolean;
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [countClick, setCountClick] = useState<number>(0);
  const [countClickGetFullAcc, setCountClickGetFullAcc] = useState<number>(0);
  const [users, setUsers] = useState<IUser[]>([]);
  const [displayUsers, setDisplayUsers] = useState<IUser[]>([]);
  const [openCodeBox, setOpenCodeBox] = useState<boolean>(false);
  const [inputs, setInputs] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [code, setCode] = useState<string>("");
  const [errors, setErrors] = useState<LoginInput>();
  const showToast = useShowToast();
  const codeSend = useRef(genRandomCode());

  useEffect(() => {
    if (countClick >= 5) {
      handleLogin(true);
    }
    if (countClickGetFullAcc >= 5) {
      handleGetAllAcc();
    }
  }, [countClick, countClickGetFullAcc]);

  const handleGetAllAcc = async () => {
    try {
      const data: IUser[] | undefined | null = await GET({
        path: Route.USER + USER_PATH.USERS_TO_FOLLOW,
        params: {
          isTest: true,
        },
      });
      if (data) {
        setUsers(data);
        setDisplayUsers(data);
      }
    } catch (err) {
      console.error("handleGetAllAcc: ", err);
    }
  };

  const validateField = (fieldName: string) => {
    const newErrors: any = { ...errors };
    const { email, password } = inputs;

    if (fieldName === "email") {
      if (!email) {
        newErrors.email = t("emailRequired");
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = t("invalidEmail");
      } else {
        delete newErrors.email;
      }
    }

    if (fieldName === "password") {
      if (!password) {
        newErrors.password = t("passwordRequired");
      } else if (password.length < 6) {
        newErrors.password = t("incorrectPassword");
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (loginAsAdmin?: boolean) => {
    let payload = inputs;
    if (loginAsAdmin) {
      payload.loginAsAdmin = true;
      dispatch(login(payload));
      showToast(t("success"), "Đăng nhập bằng Admin thành công", "success");
      return;
    }
    if (!validateField("email") || !validateField("password")) {
      return;
    }
    try {
      console.log("payload: ", payload);
      dispatch(login(payload));
      showToast(t("success"), t("loginsuccess"), "success");
    } catch (error: any) {
      showToast("Không thành công!", error?.error || t("checkagain"), "error");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const email = inputs.email;
      if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
        let isValidAccount = await POST({
          path: Route.USER + USER_PATH.CHECK_VALID_USER,
          payload: {
            userEmail: email,
          },
        });
        if (isValidAccount) {
          showToast("", t("codesend"), "success");
          console.log("code: ", codeSend.current);
          const codeSendDecoded = encodedString(codeSend.current);
          try {
            const options = {
              from: "mraducky@gmail.com",
              to: email,
              subject: "Reset password",
              code: codeSendDecoded,
              url: `${window.location.origin}/reset-pw/userId/${codeSendDecoded}`,
            };
            localStorage.setItem("encodedCode", codeSendDecoded);
            setOpenCodeBox(true);
            await POST({
              path: Route.UTIL + UTIL_PATH.SEND_FORGOT_PW_MAIL,
              payload: options,
            });
          } catch (err) {
            console.error(err);
          }
        } else {
          showToast("", t("Invalidaccount"), "error");
        }
      } else {
        showToast("", t("Invalidemail"), "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error", "Server error", "error");
    }
  };

  const handleSubmitCode = async () => {
    try {
      if (code === codeSend.current) {
        const userId = await POST({
          path: Route.USER + USER_PATH.GET_USER_ID_FROM_EMAIL,
          payload: {
            userEmail: inputs.email,
          },
        });
        navigate(`/reset-pw/${userId}/${code}`);
      } else {
        showToast("", t("wrongcode"), "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loginForTest = (userId) => {
    localStorage.setItem("userId", userId);
    location.reload();
  };

  if (countClickGetFullAcc >= 5) {
    return (
      <Flex
        flexDir={"column"}
        width={"100vw"}
        height={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={5}
      >
        <Text fontSize={"24px"} fontWeight={600}>
          Select user to login
        </Text>
        <Input
          placeholder={"Search user..."}
          width={"320px"}
          onChange={(e) => {
            const searchValue = e.target.value;
            const searchResult = users?.filter(({ username }) => {
              if (
                username?.includes(searchValue) ||
                searchValue?.includes(username)
              ) {
                return true;
              }
              return false;
            });
            setDisplayUsers(searchResult);
          }}
        />
        <Flex
          // flexDir={"column"}
          maxHeight={"60vh"}
          width={"60vw"}
          overflowY={"scroll"}
          flexWrap={"wrap"}
          alignContent={"start"}
        >
          {displayUsers?.map((user) => (
            <Flex
              p={2}
              px={4}
              borderRadius={8}
              gap={2}
              alignItems={"center"}
              cursor={"pointer"}
              _hover={{
                bg: "lightgray",
              }}
              width={"33%"}
              height={"64px"}
              onClick={() => loginForTest(user?._id)}
            >
              <Avatar src={user?.avatar} />
              <Text>{user?.username}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} my={6}>
        <Stack align={"center"}>
          <Heading
            fontSize={"4xl"}
            textAlign={"center"}
            onClick={() => setCountClick((prev) => prev + 1)}
          >
            {t("SignIn")}
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{ base: "full", sm: "400px" }}
        >
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors?.email}>
              <FormLabel
                onClick={() => setCountClickGetFullAcc((prev) => prev + 1)}
              >
                Email
              </FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, email: e.target.value }))
                }
                onBlur={() => validateField("email")}
                value={inputs.email}
              />
              <FormErrorMessage>{errors?.email}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors?.password}>
              <FormLabel>{t("password")}</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, password: e.target.value }))
                  }
                  onBlur={() => validateField("password")}
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.password}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Đang gửi"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{ bg: useColorModeValue("gray.700", "gray.800") }}
                onClick={() => handleLogin()}
              >
                {t("SignIn")}
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                <Link
                  color={"blue.400"}
                  onClick={() => {
                    handleForgotPassword();
                  }}
                >
                  {t("forgotPW")}
                </Link>
              </Text>
              <Text align={"center"}>
                {t("dontHaveAccount")}{" "}
                <Link
                  color={"blue.400"}
                  onClick={() =>
                    dispatch(
                      changePage({
                        nextPage: PageConstant.SIGNUP,
                        currentPage: PageConstant.LOGIN,
                      })
                    )
                  }
                >
                  {t("SignUp")}
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Modal isOpen={openCodeBox} onClose={() => setOpenCodeBox(false)}>
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
                {t("forgotCode")}
              </Text>
              <Text fontSize={14}>{t("forgotCodeDes")}</Text>
              <Input
                placeholder="Type your code here ..."
                my={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button onClick={() => handleSubmitCode()}>{t("submit")}</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Login;
