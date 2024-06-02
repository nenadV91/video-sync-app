import { ReactNode, useReducer } from "react";
import {
  videoReducer,
  initialState,
  VideoStateContext,
  VideoDispatchContext,
} from "./state";

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  return (
    <VideoStateContext.Provider value={state}>
      <VideoDispatchContext.Provider value={dispatch}>
        {children}
      </VideoDispatchContext.Provider>
    </VideoStateContext.Provider>
  );
};
