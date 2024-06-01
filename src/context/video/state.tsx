import { createContext } from "react";

interface VideoState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  wasPlayingBeforeDrag: boolean;
}

export enum VideoActions {
  SET_CURRENT_TIME = "SET_CURRENT_TIME",
  SET_DURATION = "SET_DURATION",
  SET_IS_PLAYING = "SET_IS_PLAYING",
  SET_WAS_PLAYING_BEFORE_DRAG = "SET_WAS_PLAYING_BEFORE_DRAG",
}

type VideoAction =
  | { type: VideoActions.SET_CURRENT_TIME; payload: number }
  | { type: VideoActions.SET_DURATION; payload: number }
  | { type: VideoActions.SET_IS_PLAYING; payload: boolean }
  | { type: VideoActions.SET_WAS_PLAYING_BEFORE_DRAG; payload: boolean };

export const VideoStateContext = createContext<VideoState | null>(null);
export const VideoDispatchContext =
  createContext<React.Dispatch<VideoAction> | null>(null);

export const initialState: VideoState = {
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  wasPlayingBeforeDrag: false,
};

export function videoReducer(
  state: VideoState,
  action: VideoAction
): VideoState {
  switch (action.type) {
    case VideoActions.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload };

    case VideoActions.SET_DURATION:
      return { ...state, duration: action.payload };

    case VideoActions.SET_IS_PLAYING:
      return { ...state, isPlaying: action.payload };

    case VideoActions.SET_WAS_PLAYING_BEFORE_DRAG:
      return { ...state, wasPlayingBeforeDrag: action.payload };

    default:
      return { ...state };
  }
}
