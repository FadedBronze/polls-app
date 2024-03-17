import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuthContext } from "./AuthContext";

const GraphSchema = z.object({
  title: z.string(),
  background: z.string(),
  data: z.object({ name: z.string(), color: z.string(), votes: z.number() }).array(),
  font_size: z.number(),
  font: z.string(),
  title_size: z.number(),
  authorName: z.string(),
  poll_id: z.number(),
});

type GraphData = z.infer<typeof GraphSchema>;

export default function MessageViewer() {
  const [graphData, setGraphData] = useState<GraphData[] | undefined>();
  const auth = useAuthContext();

  useEffect(() => {
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

  return (
    <div>
      {graphData &&
        graphData.map((graph) => {
          return (
            <div
              key={graph.poll_id}
              className="border-t border bg-white backdrop-blur-md m-4 mt-6 rounded-md"
            >
              <div className="flex justify-between mb-2">
                <h2 className="text-lg p-3 font-bold">{graph.title}</h2>{" "}
                <p className="text-sm p-3 text-right">Author: {graph.authorName}</p>
              </div>
              <button className="grid gap-3 p-3 grid-cols-2 w-full">
                {graph.data.map((choice) => {
                  return (
                    <div
                      className="rounded-md p-4 shadow-md"
                      style={{
                        backgroundColor: choice.color,
                      }}
                      key={choice.name + graph.poll_id}
                    >
                      {choice.name}
                    </div>
                  );
                })}
              </button>
            </div>
          );
        })}
    </div>
  );
}
