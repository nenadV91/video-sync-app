import { Pause, PlayArrow, Replay } from "@mui/icons-material";
import { Box, Grid, IconButton, Slider, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import { useVideoDispatch, useVideoState } from "./context/video/hooks";
import { VideoProvider } from "./context/video/provider";
import { VideoActions } from "./context/video/state";

const App: React.FC = () => {
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  const { currentTime, duration, isPlaying, wasPlayingBeforeDrag } =
    useVideoState();
  const dispatch = useVideoDispatch();

  // Sync the current time of both videos
  const syncTime = useCallback((time: number) => {
    if (video1Ref.current) video1Ref.current.currentTime = time;
    if (video2Ref.current) video2Ref.current.currentTime = time;
  }, []);

  // Play or pause both videos
  const handlePlayPause = useCallback((action: "play" | "pause") => {
    if (video1Ref.current && video2Ref.current) {
      if (action === "play") {
        video1Ref.current
          .play()
          .catch((error) => console.log("Error playing video 1:", error));
        video2Ref.current
          .play()
          .catch((error) => console.log("Error playing video 2:", error));
        dispatch({ type: VideoActions.SET_IS_PLAYING, payload: true });
      } else {
        video1Ref.current.pause();
        video2Ref.current.pause();
        dispatch({ type: VideoActions.SET_IS_PLAYING, payload: false });
      }
    }
  }, []);

  // Handle seeking by setting the current time state
  const updateCurrentTime = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      dispatch({
        type: VideoActions.SET_CURRENT_TIME,
        payload: e.currentTarget.currentTime,
      });
    },
    []
  );

  // Stop both videos and reset the current time
  const handleReset = useCallback(() => {
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.pause();
      video2Ref.current.pause();
      dispatch({ type: VideoActions.SET_CURRENT_TIME, payload: 0 });
      dispatch({ type: VideoActions.SET_IS_PLAYING, payload: false });
    }
  }, []);

  // Handle slider events
  const handleSliderChange = useCallback(
    (_: Event, value: number | number[]) => {
      dispatch({
        type: VideoActions.SET_CURRENT_TIME,
        payload: value as number,
      });
      syncTime(value as number);
    },
    []
  );

  const handleMouseDown = useCallback(() => {
    dispatch({
      type: VideoActions.SET_WAS_PLAYING_BEFORE_DRAG,
      payload: isPlaying,
    });
    handlePlayPause("pause");
  }, [isPlaying]);

  const handleMouseUp = useCallback(() => {
    if (wasPlayingBeforeDrag) {
      handlePlayPause("play");
    }
  }, [wasPlayingBeforeDrag]);

  // Handle video metadata
  const handleLoadedMetadata = useCallback(() => {
    if (video1Ref.current) {
      dispatch({
        type: VideoActions.SET_DURATION,
        payload: video1Ref.current.duration,
      });
    }
  }, []);

  // Update both videos' current time whenever the state changes while not playing
  useEffect(() => {
    if (!isPlaying) {
      syncTime(currentTime);
    }
  }, [currentTime, isPlaying]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
      px={4}
      py={6}
    >
      <Typography fontWeight={"300"} variant="h4">
        Video sync demo
      </Typography>

      <Grid justifyContent={"center"} p={2} my={2} maxWidth={"md"} container>
        <Box
          gap={2}
          width={"100%"}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
        >
          <IconButton onClick={handleReset}>
            <Replay sx={{ fontSize: "1rem" }} />
          </IconButton>

          <IconButton
            onClick={() => handlePlayPause(isPlaying ? "pause" : "play")}
          >
            {isPlaying ? (
              <Pause sx={{ fontSize: "2.6rem" }} />
            ) : (
              <PlayArrow sx={{ fontSize: "2.6rem" }} />
            )}
          </IconButton>

          <Typography variant="caption">{currentTime.toFixed(2)}</Typography>
        </Box>

        <Slider
          size="small"
          aria-label="Small"
          valueLabelDisplay="auto"
          min={0}
          value={currentTime}
          max={duration}
          step={0.1}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </Grid>

      <Grid maxWidth={"md"} justifyContent={"center"} spacing={2} container>
        <Grid item>
          <video
            ref={video1Ref}
            width="426"
            height="240"
            controls
            onPlay={() => handlePlayPause("play")}
            onPause={() => handlePlayPause("pause")}
            onTimeUpdate={updateCurrentTime}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>

        <Grid item>
          <video
            ref={video2Ref}
            width="426"
            height="240"
            controls
            onPlay={() => handlePlayPause("play")}
            onPause={() => handlePlayPause("pause")}
            onTimeUpdate={updateCurrentTime}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default () => (
  <VideoProvider>
    <App />
  </VideoProvider>
);
