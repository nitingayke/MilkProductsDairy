import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../../services/userService";
import { useSnackbar } from "notistack";
import { AdminAuthContext, UserAuthContext } from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";


export default function GoogleLoginComponent() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { handleAdminLogout } = useContext(AdminAuthContext);
  const { fetchUserData, setOpenLoginDialog } = useContext(UserAuthContext);

  return (

    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const res = await loginWithGoogle(credentialResponse.credential); 

          if (res?.success) {

            setOpenLoginDialog(false);

            if (!res?.filledBasicInfo) {
              navigate("/signup/info-input", {
                state: { user: res?.user, viaLogin: true },
              });
            } else {

              localStorage.setItem("User", JSON.stringify({
                email: res?.user?.email,
                _id: res?.user?._id
              }));
              await fetchUserData(res?.user?._id);

              handleAdminLogout();
              enqueueSnackbar("Login Successful!", { variant: "success" });
              navigate("/home");
            }
          } else {
            enqueueSnackbar("Login failed, please try again.", { variant: "error" });
          }
        } catch (err) {
          const message =
            err.response?.data?.message || "Error logging in with Google.";
          enqueueSnackbar(message, { variant: "error" });
        }
      }}

      onError={() => {
        console.log("here")
        enqueueSnackbar("Google Login Failed", { variant: "error" });
      }}
    />
  );
}