import React, { createContext, useContext, useState } from "react";
import { GraphProps } from "./PollGraph";
import { JSX } from "react";
import { black, pastel_orange, pastel_blue, pastel_violet, pastel_green } from "../utils/color";

const PostContext = createContext<{
  graphOptions: GraphOptions,
  graphData: GraphData,
  setGraphOptions: React.Dispatch<React.SetStateAction<GraphOptions>>,
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any)

// eslint-disable-next-line react-refresh/only-export-components
export const usePostContext = () => useContext(PostContext)

type GraphOptions = Omit<GraphProps, "data" | "width" | "height">;
type GraphData = GraphProps["data"];

export function PostContextProvider(props: {children: JSX.Element}) {
  const [graphOptions, setGraphOptions] = useState<GraphOptions>({
    background: black,
    fontSize: 20,
    titleSize: 35,
    title: "Favorite Thing",
    font: "sans-serif",
  });

  const [graphData, setGraphData] = useState<GraphData>([
    ["House", pastel_orange, 1],
    ["Bat", pastel_blue, 1],
    ["Moose", pastel_violet, 3],
    ["Box", pastel_green, 2],
  ]);

  return <PostContext.Provider value={{
    graphData,
    graphOptions,
    setGraphData,
    setGraphOptions,
  }}>{props.children}</PostContext.Provider> 
}