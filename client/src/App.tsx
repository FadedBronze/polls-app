import Navbar from "./Components/Navbar";
import MessageBar from "./Components/MessageBar";
import MessageViewer from "./Components/MessageViewer";

function App() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <img
        className="object-cover absolute -z-10 object-center w-full h-full"
        src="https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg?cs=srgb&dl=pexels-codioful-%28formerly-gradienta%29-7130555.jpg&fm=jpg"
      ></img>
      <div className="md:px-[20vw] max-md:px-4 w-full flex flex-col gap-4 overflow-y-scroll py-6">
        <Navbar></Navbar>
        <div className="bg-white bg-opacity-40 backdrop-blur-md rounded-md mb-0 flex flex-col justify-end">
          <MessageViewer></MessageViewer>
        </div>
        <div className="bg-transparent">
          <MessageBar></MessageBar>
        </div>
      </div>
    </div>
  );
}

export default App;
