import { useCallback, useEffect, useRef } from "react";
import { useVideoDispatch, useVideoState } from "../context/video/hooks";
import { VideoActions } from "../context/video/state";

export function Video({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  const { isPlaying, currentTime } = useVideoState();
  const dispatch = useVideoDispatch();

  const updateCurrentTime = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      dispatch({
        type: VideoActions.SET_CURRENT_TIME,
        payload: e.currentTarget.currentTime,
      });
    },
    []
  );

  const handleLoadedMetadata = useCallback(() => {
    if (ref.current) {
      dispatch({
        type: VideoActions.SET_DURATION,
        payload: ref.current.duration,
      });
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    isPlaying
      ? ref.current
          .play()
          .catch((error) => console.log("Error playing video", error))
      : ref.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (!ref.current || isPlaying) return;
    ref.current.currentTime = currentTime;
  }, [currentTime]);

  return (
    <video
      ref={ref}
      width="426"
      height="240"
      controls
      onPlay={() =>
        dispatch({
          type: VideoActions.SET_IS_PLAYING,
          payload: true,
        })
      }
      onPause={() =>
        dispatch({
          type: VideoActions.SET_IS_PLAYING,
          payload: false,
        })
      }
      onTimeUpdate={updateCurrentTime}
      onLoadedMetadata={handleLoadedMetadata}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
