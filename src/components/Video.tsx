import { useCallback, useEffect, useRef } from "react";
import { isFirefox } from "react-device-detect";
import { useVideoDispatch, useVideoState } from "../context/video/hooks";
import { VideoActions } from "../context/video/state";

export function Video({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  const { isPlaying, currentTime, isSeeking, playbackRate } = useVideoState();
  const dispatch = useVideoDispatch();

  const updateCurrentTime = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      if (!isSeeking) {
        dispatch({
          type: VideoActions.SET_CURRENT_TIME,
          payload: e.currentTarget.currentTime,
        });
      }
    },
    [isSeeking]
  );

  const handleSeeking = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      dispatch({
        type: VideoActions.SET_IS_SEEKING,
        payload: true,
      });

      if (isFirefox) {
        dispatch({
          type: VideoActions.SET_CURRENT_TIME,
          payload: e.currentTarget.currentTime,
        });
      }
    },
    [isFirefox]
  );

  const handleSeeked = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      dispatch({
        type: VideoActions.SET_IS_SEEKING,
        payload: false,
      });

      dispatch({
        type: VideoActions.SET_CURRENT_TIME,
        payload: e.currentTarget.currentTime,
      });
    },
    [isFirefox]
  );

  const handleLoadedMetadata = useCallback(() => {
    if (ref.current) {
      dispatch({
        type: VideoActions.SET_DURATION,
        payload: ref.current.duration,
      });
    }
  }, []);

  const handleRateChange = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      dispatch({
        type: VideoActions.SET_PLAYBACK_RATE,
        payload: e.currentTarget.playbackRate,
      });
    },
    []
  );

  const handlePlay = useCallback(() => {
    dispatch({
      type: VideoActions.SET_IS_PLAYING,
      payload: true,
    });
  }, []);

  const handlePause = useCallback(() => {
    dispatch({
      type: VideoActions.SET_IS_PLAYING,
      payload: false,
    });
  }, []);

  useEffect(() => {
    if (ref.current) {
      isPlaying
        ? ref.current
            .play()
            .catch((error) => console.log("Error playing video", error))
        : ref.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (ref.current && !isPlaying) {
      ref.current.currentTime = currentTime;
    }
  }, [currentTime, isPlaying]);

  useEffect(() => {
    if (ref.current) {
      ref.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <video
      ref={ref}
      width="426"
      height="240"
      controls
      onPlay={handlePlay}
      onPause={handlePause}
      onRateChange={handleRateChange}
      onSeeked={handleSeeked}
      onSeeking={handleSeeking}
      onTimeUpdate={updateCurrentTime}
      onLoadedMetadata={handleLoadedMetadata}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
