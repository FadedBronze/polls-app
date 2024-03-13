import { useRef, useState } from "react";
import PollGraph from "./PollGraph";
import { usePostContext } from "./PostContext";
import PollEditor from "./PollEditor";
import useMouse from "../hooks/useMouse";

export default function MessageBar() {
  const { graphData, graphOptions, setGraphOptions } = usePostContext();
  const [openPoll, setOpenPoll] = useState(false);
  const barRef = useRef<HTMLDivElement>(null)
  const mouse = useMouse(barRef)

  return (
    <>
      <div ref={barRef} className="bg-white relative flex justify-between p-1">
        {mouse.over && <div className="absolute -top-1 -translate-y-full">
          <PollGraph {...graphOptions} data={graphData} width={300} height={300}></PollGraph>
        </div>}
        <input
          placeholder="title"
          onChange={(e) => {
            const newOptions = { ...graphOptions };
            newOptions["title"] = e.currentTarget.value;
            setGraphOptions(newOptions);
          }}
        ></input>
        <div className="flex gap-1">
          <button
            onClick={() => setOpenPoll(true)}
            className="rounded-md bg-green-600 text-white p-2"
          >
            Edit
          </button>
          <button className="rounded-md bg-blue-500 text-white p-2" onClick={() => {
            console.log(graphData, graphOptions)
          }}>Send</button>
        </div>
      </div>
      {openPoll && <PollEditor setPollEditor={setOpenPoll}></PollEditor>}
    </>
  );
}
