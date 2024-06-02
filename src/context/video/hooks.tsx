import { useContext } from "react";
import { VideoStateContext, VideoDispatchContext } from "./state";

export const useVideoState = () => {
  const context = useContext(VideoStateContext);

  if (!context) {
    throw new Error("useVideoState must be used within a VideoProvider");
  }

  return context;
};

export const useVideoDispatch = () => {
  const context = useContext(VideoDispatchContext);

  if (!context) {
    throw new Error("useVideoDispatch must be used within a VideoProvider");
  }

  return context;
};
