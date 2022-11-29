import { Button } from "@mui/material";
import { Auth   } from "@aws-amplify/auth";

const Logout = () => {

  return (
    <>
      <h1 style={{textAlign: "center"}}>logout from here guy</h1>
      <Button sx={{display: "block", margin: "0px auto"}} variant="outlined" onClick={() => Auth.signOut().then(() => window.location.reload())} color="secondary">Logout</Button>
    </>
  );
};

export default Logout;
