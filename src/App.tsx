import { Pause, PlayArrow, Replay } from "@mui/icons-material";
import { Box, Grid, IconButton, Slider, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";

const App: React.FC = () => {
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] =
    useState<boolean>(false);

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
        setIsPlaying(true);
      } else {
        video1Ref.current.pause();
        video2Ref.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  // Handle seeking by setting the current time state
  const updateCurrentTime = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setCurrentTime(e.currentTarget.currentTime);
    },
    []
  );

  // Stop both videos and reset the current time
  const handleReset = useCallback(() => {
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.pause();
      video2Ref.current.pause();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, []);

  // Handle slider events
  const handleSliderChange = useCallback(
    (_: Event, value: number | number[]) => {
      setCurrentTime(value as number);
      syncTime(value as number);
    },
    []
  );

  const handleMouseDown = useCallback(() => {
    setWasPlayingBeforeDrag(isPlaying);
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
      setDuration(video1Ref.current.duration);
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
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
      px={4}
    >
      <Typography mb={4} variant="h4">
        Synchronized Video Players
      </Typography>

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

      <Grid justifyContent={"center"} mt={4} maxWidth={"md"} container>
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

        <Box>
          <IconButton
            onClick={() => handlePlayPause(isPlaying ? "pause" : "play")}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton onClick={handleReset}>
            <Replay />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default App;
