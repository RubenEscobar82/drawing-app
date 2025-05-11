import { CanvasContextProvider } from "@src/components";
import { Workspace } from "@src/views";
import "./styles/main.scss";

function App() {
  return (
    <CanvasContextProvider>
      <Workspace />
    </CanvasContextProvider>
  );
}

export default App;
