import Routers from "./routes/Routers";
import "./index.css";
import { SnackbarProvider } from "notistack";

function App() {

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={2000}
    >
      <Routers />
    </SnackbarProvider>
  );
}

export default App;
