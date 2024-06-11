import { createContext } from "react";
import { VIDEO_SRC } from "../../constants";

interface VideoState {
  currentTime: number;
  duration: number;
  playbackRate: number;
  isPlaying: boolean;
  isSeeking: boolean;
  wasPlayingBeforeDrag: boolean;
  videos: string[];
}

export enum VideoActions {
  SET_CURRENT_TIME = "SET_CURRENT_TIME",
  SET_DURATION = "SET_DURATION",
  SET_PLAYBACK_RATE = "SET_PLAYBACK_RATE",
  SET_IS_PLAYING = "SET_IS_PLAYING",
  SET_IS_SEEKING = "SET_IS_SEEKING",
  SET_WAS_PLAYING_BEFORE_DRAG = "SET_WAS_PLAYING_BEFORE_DRAG",
  ADD_VIDEO = "ADD_VIDEO",
  REMOVE_LAST_VIDEO = "REMOVE_LAST_VIDEO",
}

type VideoAction =
  | { type: VideoActions.SET_CURRENT_TIME; payload: number }
  | { type: VideoActions.SET_DURATION; payload: number }
  | { type: VideoActions.SET_PLAYBACK_RATE; payload: number }
  | { type: VideoActions.SET_IS_PLAYING; payload: boolean }
  | { type: VideoActions.SET_IS_SEEKING; payload: boolean }
  | { type: VideoActions.SET_WAS_PLAYING_BEFORE_DRAG; payload: boolean }
  | { type: VideoActions.ADD_VIDEO; payload: string }
  | { type: VideoActions.REMOVE_LAST_VIDEO };

export const VideoStateContext = createContext<VideoState | null>(null);
export const VideoDispatchContext =
  createContext<React.Dispatch<VideoAction> | null>(null);

const initialVideosState = [VIDEO_SRC, VIDEO_SRC];
export const initialState: VideoState = {
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  isPlaying: false,
  wasPlayingBeforeDrag: false,
  isSeeking: false,
  videos: initialVideosState,
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

    case VideoActions.SET_PLAYBACK_RATE:
      return { ...state, playbackRate: action.payload };

    case VideoActions.SET_IS_PLAYING:
      return { ...state, isPlaying: action.payload };

    case VideoActions.SET_IS_SEEKING:
      return { ...state, isSeeking: action.payload };

    case VideoActions.SET_WAS_PLAYING_BEFORE_DRAG:
      return { ...state, wasPlayingBeforeDrag: action.payload };

    case VideoActions.ADD_VIDEO:
      return {
        ...state,
        videos: [...state.videos, action.payload],
        isPlaying: false,
        currentTime: 0,
      };

    case VideoActions.REMOVE_LAST_VIDEO:
      return {
        ...state,
        videos: state.videos.slice(0, -1),
        isPlaying: false,
        currentTime: 0,
      };

    default:
      return { ...state };
  }
}
