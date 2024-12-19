import { GoogleLogin } from "@react-oauth/google";

const GoogleAuthButton = ({ onSuccess, onError }: any) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap
      size="large"
      shape="pill"
      theme="filled_black"
    />
  );
};

export default GoogleAuthButton;
