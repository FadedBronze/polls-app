import Navbar from "./Components/Navbar";
import MessageBar from "./Components/MessageBar";

function App() {
  return (
    <div className="h-full w-full flex flex-col">
      <Navbar></Navbar>
      <div className="w-full flex flex-col items-center h-full bg-gray-300">
        <div className="w-2/3 bg-gray-400 h-full flex flex-col justify-end">
          <MessageBar></MessageBar>          
        </div>
      </div>
    </div>
  );
}

export default App;
