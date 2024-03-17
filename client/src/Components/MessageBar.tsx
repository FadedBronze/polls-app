import { useRef, useState } from "react";
import PollGraph from "./PollGraph";
import { usePostContext } from "./PostContext";
import PollEditor from "./PollEditor";
import useMouse from "../hooks/useMouse";
import { useAuthContext } from "./AuthContext";
import { colorString } from "../utils/color";

export default function MessageBar() {
  const { graphData, graphOptions, setGraphOptions } = usePostContext();
  const [openPoll, setOpenPoll] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const mouse = useMouse(barRef);
  const auth = useAuthContext();

  return (
    <>
      <div
        ref={barRef}
        className="bg-white bg-opacity-40 rounded-lg p-3 relative flex justify-between"
      >
        {mouse.over && (
          <div className="absolute -top-1 -translate-y-full">
            <PollGraph {...graphOptions} data={graphData} width={300} height={300}></PollGraph>
          </div>
        )}
        <input
          placeholder="title"
          className="bg-transparent max-w-20"
          onChange={(e) => {
            const newOptions = { ...graphOptions };
            newOptions["title"] = e.currentTarget.value;
            setGraphOptions(newOptions);
          }}
        ></input>
        <div className="flex gap-2">
          <button onClick={() => setOpenPoll(true)} className="rounded-md bg-white p-2">
            Edit
          </button>
          <button
            className="rounded-md bg-white p-2"
            onClick={() => {
              if (!auth.authed) return;

              fetch("/api/post/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...auth.data.authHeader,
                },
                body: JSON.stringify({
                  choices: graphData.map((value) => ({
                    ...value,
                    color: colorString(value.color),
                  })),
                  ...graphOptions,
                  background: colorString(graphOptions.background),
                }),
              });
            }}
          >
            Send
          </button>
        </div>
        {!auth.authed && (
          <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex justify-center items-center">
            Please make an account
          </div>
        )}
      </div>
      {openPoll && <PollEditor setPollEditor={setOpenPoll}></PollEditor>}
    </>
  );
}
