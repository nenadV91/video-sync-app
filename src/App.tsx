import { Add, Pause, PlayArrow, Remove, Replay } from "@mui/icons-material";
import { Box, Grid, IconButton, Slider, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { Video } from "./components/Video";
import { VIDEO_SRC } from "./constants";
import { useVideoDispatch, useVideoState } from "./context/video/hooks";
import { VideoProvider } from "./context/video/provider";
import { VideoActions } from "./context/video/state";

const App: React.FC = () => {
  const { currentTime, duration, isPlaying, wasPlayingBeforeDrag, videos } =
    useVideoState();
  const dispatch = useVideoDispatch();

  const handleReset = useCallback(() => {
    dispatch({ type: VideoActions.SET_CURRENT_TIME, payload: 0 });
    dispatch({ type: VideoActions.SET_IS_PLAYING, payload: false });
  }, []);

  const handleSliderChange = useCallback(
    (_: Event, value: number | number[]) => {
      dispatch({
        type: VideoActions.SET_CURRENT_TIME,
        payload: value as number,
      });
    },
    []
  );

  const handleMouseDown = useCallback(() => {
    dispatch({
      type: VideoActions.SET_WAS_PLAYING_BEFORE_DRAG,
      payload: isPlaying,
    });

    dispatch({
      type: VideoActions.SET_IS_PLAYING,
      payload: false,
    });
  }, [isPlaying]);

  const handleMouseUp = useCallback(() => {
    if (wasPlayingBeforeDrag) {
      dispatch({
        type: VideoActions.SET_IS_PLAYING,
        payload: true,
      });
    }
  }, [wasPlayingBeforeDrag]);

  const handlePlayPause = useCallback(() => {
    dispatch({
      type: VideoActions.SET_IS_PLAYING,
      payload: !isPlaying,
    });
  }, [isPlaying]);

  const handleAddVideo = useCallback(() => {
    dispatch({
      type: VideoActions.ADD_VIDEO,
      payload: VIDEO_SRC,
    });
  }, []);

  const handleRemoveVideo = useCallback(() => {
    dispatch({
      type: VideoActions.REMOVE_LAST_VIDEO,
    });
  }, []);

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

          <IconButton onClick={handlePlayPause}>
            {isPlaying ? (
              <Pause sx={{ fontSize: "2.6rem" }} />
            ) : (
              <PlayArrow sx={{ fontSize: "2.6rem" }} />
            )}
          </IconButton>

          <IconButton disabled={videos.length >= 4} onClick={handleAddVideo}>
            <Add sx={{ fontSize: "1rem" }} />
          </IconButton>

          <IconButton disabled={videos.length <= 2} onClick={handleRemoveVideo}>
            <Remove sx={{ fontSize: "1rem" }} />
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
        {videos.map((src, idx) => (
          <Grid key={idx} item>
            <Video src={src} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default () => (
  <VideoProvider>
    <App />
  </VideoProvider>
);
