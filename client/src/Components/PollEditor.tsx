import PollGraph from "./PollGraph";
import { colorString, hex } from "../utils/color";
import { objectKeys } from "../utils/safeKeys";
import { useErrorModal } from "./ErrorModal";
import { usePostContext } from "./PostContext";
import useWindowSize from "../hooks/useWindowSize";

export default function PollEditor(props: { setPollEditor: (value: boolean) => void }) {
  const { graphData, graphOptions, setGraphData, setGraphOptions } = usePostContext();
  const { createModal } = useErrorModal();
  const [x] = useWindowSize();

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 backdrop-blur-md"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-md:w-[calc(100vw-20px)] max-md:h-[calc(100vh-20px)] w-2/3 min-h-2/3 max-h-full overflow-y-auto bg-white rounded-md">
        <div className="flex justify-between p-2">
          <h2>Poll Editor 3001</h2>
          <button onClick={() => props.setPollEditor(false)}>❌</button>
        </div>
        <div className="flex flex-wrap overflow-x-hidden">
          <div className="flex-grow flex items-center justify-center bg-gray-600">
            <PollGraph
              width={Math.min(500, x)}
              height={Math.min(500, x)}
              {...graphOptions}
              data={graphData}
            ></PollGraph>
          </div>
          <div className="p-2 flex flex-col gap-2 items-baseline flex-grow">
            <button
              onClick={() => {
                if (graphData.some(({ name }) => name === "new")) {
                  createModal("cannot create choice with duplicate name", "ERROR");
                  return;
                }

                const newGraphData = [...graphData];
                newGraphData.push({ name: "new", color: [0, 0, 0], votes: 1 });
                setGraphData(newGraphData);
              }}
            >
              Add Choice
            </button>
            {graphData.map(({ name, color, votes }) => (
              <div key={name} className="border-t border-black w-full pt-2 flex flex-row gap-2">
                <label
                  className="w-6 h-6 rounded-full border border-black"
                  style={{
                    backgroundColor: colorString(color),
                  }}
                >
                  <input
                    type="color"
                    className="invisible"
                    onChange={(e) => {
                      const value = hex(e.currentTarget.value);

                      const newGraphData = [...graphData];
                      newGraphData.find((choice) => choice.name === name)!.color = value;
                      setGraphData(newGraphData);
                    }}
                  ></input>
                </label>
                <input
                  className="border-b border-black"
                  defaultValue={name}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;

                    const value = e.currentTarget.value;

                    if (graphData.some((choice) => choice.name === value)) {
                      createModal("cannot create choice with duplicate name", "ERROR");
                      return;
                    }

                    const newGraphData = [...graphData];
                    newGraphData.find((choice) => choice.name === name)!.name = value;
                    setGraphData(newGraphData);
                  }}
                ></input>
                <label className="flex-grow">
                  <input
                    className="border-b border-black w-full"
                    defaultValue={votes}
                    type="number"
                    onChange={(e) => {
                      const value = parseFloat(e.currentTarget.value);

                      const newGraphData = [...graphData];
                      newGraphData.find((choice) => choice.name === name)!.votes = value;
                      setGraphData(newGraphData);
                    }}
                  ></input>
                </label>

                <button
                  onClick={() => {
                    setGraphData((old) => old.filter((choice) => choice.name !== name));
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-[1px] p-[1px] bg-black xl:grid-cols-4 max-md:grid-cols-2">
          {objectKeys(graphOptions).map((key) => {
            switch (key) {
              case "fontSize":
              case "titleSize":
                return (
                  <label key={key} className="bg-white px-2 inline-flex items-center">
                    {key}:{" "}
                    <input
                      className="ml-2 min-w-16"
                      type="number"
                      onChange={(e) => {
                        const newOptions = { ...graphOptions };
                        newOptions[key] = parseFloat(e.currentTarget.value);
                        setGraphOptions(newOptions);
                      }}
                      defaultValue={graphOptions[key]}
                    ></input>
                  </label>
                );
              case "font":
              case "title":
                return (
                  <label key={key} className="bg-white px-2 inline-flex items-center">
                    {key}:{" "}
                    <input
                      className="min-w-16"
                      onChange={(e) => {
                        const newOptions = { ...graphOptions };
                        newOptions[key] = e.currentTarget.value;
                        setGraphOptions(newOptions);
                      }}
                      type="text"
                      defaultValue={graphOptions[key]}
                    ></input>
                  </label>
                );
              case "background":
                return (
                  <div className="bg-white flex flex-row items-center">
                    <div className="px-2">{key}:</div>
                    <label
                      key={key}
                      className="flex-grow"
                      style={{
                        backgroundColor: colorString(graphOptions[key]),
                      }}
                    >
                      <input
                        type="color"
                        className="invisible"
                        onChange={(e) => {
                          const newOptions = { ...graphOptions };
                          const color = hex(e.currentTarget.value);
                          newOptions[key] = color;

                          setGraphOptions(newOptions);
                        }}
                      ></input>
                    </label>
                  </div>
                );
              default:
                return <div></div>;
            }
          })}
        </div>
      </div>
    </>
  );
}
