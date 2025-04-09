import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { useAppSelector } from "../hooks/redux";
import { AppState } from "../store";
import Login from "./Login";
import Signup from "./SignUp";

const AuthPage = () => {
  const currentPage = useAppSelector(
    (state: AppState) => state.util.currentPage
  );

  return <>{currentPage === PageConstant.LOGIN ? <Login /> : <Signup />}</>;
};

export default AuthPage;
