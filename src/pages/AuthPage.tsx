import { useAppSelector } from "../hooks/redux";
import Login from "./Login";
import Signup from "./SignUp";
// import { AppState } from "../store";

const AuthPage = () => {
  //   const currentPage = useAppSelector(
  //     (state: AppState) => state.util.currentPage
  //   );

  //   return <>{currentPage === PageConstant.LOGIN ? <Login /> : <Signup />}</>;
  return <Login />;
};

export default AuthPage;
