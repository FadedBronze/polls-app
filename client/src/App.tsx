import { useState } from "react";
import Navbar from "./Components/Navbar";
import PollEditor from "./Components/PollEditor";

function App() {
  const [openPoll, setOpenPoll] = useState(false);

  return (
    <div className="h-full w-full flex flex-col">
      <Navbar></Navbar>
      <div className="w-full flex flex-col items-center h-full bg-gray-300">
        <div className="w-2/3 bg-gray-400 h-full flex flex-col justify-end">
          <div className="bg-white flex justify-between p-1">
            <input placeholder="tagline"></input>
            <button onClick={() => setOpenPoll(true)}>Edit</button>
            <button className="rounded-md bg-blue-500 text-white p-2">Send</button>
          </div>
        </div>
      </div>
      {openPoll && <PollEditor setPollEditor={setOpenPoll}></PollEditor>}
    </div>
  );
}

export default App;
