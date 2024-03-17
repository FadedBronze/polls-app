import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useAuthContext } from "./AuthContext";
import PollGraph from "./PollGraph";
import { hex } from "../utils/color";
import useWindowSize from "../hooks/useWindowSize";

const GraphSchema = z.object({
  title: z.string(),
  background: z.string(),
  data: z.object({ name: z.string(), color: z.string(), votes: z.number() }).array(),
  font_size: z.number(),
  font: z.string(),
  title_size: z.number(),
  voted: z.boolean(),
  authorName: z.string(),
  poll_id: z.number(),
});

type GraphData = z.infer<typeof GraphSchema>;

export default function MessageViewer() {
  const [graphData, setGraphData] = useState<GraphData[] | undefined>();
  const auth = useAuthContext();
  const [x] = useWindowSize();

  const size = Math.min(x > 600 ? (x * 2) / 3 - 120 : x - 150, 500);

  const updateGraphData = useCallback(() => {
    if (!auth.authed) return;

    fetch("/api/post/", {
      headers: {
        ...auth.data.authHeader,
      },
    })
      .then((data) => data.json())
      .then((json) => {
        const graphData = z.array(GraphSchema).parse(json);

        setGraphData(graphData);
      })
      .catch((err: Error) => {
        console.error(err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.authed]);

  useEffect(() => {
    updateGraphData()
  }, [updateGraphData]);

  return (
    <div>
      {graphData &&
        graphData.map((graph) => {
          return !graph.voted ? (
            <div
              key={graph.poll_id}
              className="border-t border bg-white backdrop-blur-md m-8 mt-10 rounded-md"
            >
              <div className="flex justify-between mb-2">
                <h2 className="text-lg p-3 font-bold">{graph.title}</h2>{" "}
                <p className="text-sm p-3 text-right">Author: {graph.authorName}</p>
              </div>
              <div className="grid gap-3 p-3 grid-cols-2 w-full">
                {graph.data.map((choice) => {
                  return (
                    <button
                      className="rounded-md p-4 shadow-md"
                      style={{
                        backgroundColor: choice.color,
                      }}
                      key={choice.name + graph.poll_id}
                      onClick={() => {
                        if (!auth.authed) return;

                        fetch("/api/post/vote/", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            ...auth.data.authHeader,
                          },
                          body: JSON.stringify({
                            id: graph.poll_id,
                            name: choice.name,
                          }),
                        }).then(() => updateGraphData());
                      }}
                    >
                      {choice.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              key={graph.poll_id}
              className="m-8 p-4 bg-white rounded-lg shadow-sm flex gap-4 flex-wrap justify-center"
            >
              <div className="flex-grow">
                <div className="mb-4 flex justify-between flex-wrap gap-2">
                  <div className="text-2xl">{graph.title}</div>
                  <div>Author: {graph.authorName}</div>
                </div>
                {graph.data.map((choice) => (
                  <div className="flex gap-2 items-center">
                    <div
                      className="rounded-full h-4 w-4 border border-black"
                      style={{
                        backgroundColor: choice.color,
                      }}
                    ></div>
                    <span>
                      {choice.name}: {choice.votes}
                    </span>
                  </div>
                ))}
              </div>
              <PollGraph
                {...graph}
                data={graph.data.map((data) => ({ ...data, color: hex(data.color) }))}
                fontSize={graph.font_size}
                titleSize={graph.title_size}
                width={size}
                height={size}
                background={hex(graph.background)}
              ></PollGraph>
            </div>
          );
        })}
    </div>
  );
}
