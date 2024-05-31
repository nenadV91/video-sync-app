import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Sync the current time of both videos
  const syncTime = (time: number) => {
    if (video1Ref.current) video1Ref.current.currentTime = time;
    if (video2Ref.current) video2Ref.current.currentTime = time;
  };

  // Play or pause both videos
  const handlePlayPause = (action: "play" | "pause") => {
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
  };

  // Handle seeking by setting the current time state
  const handleSeek = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  // Stop both videos and reset the current time
  const handleReset = () => {
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.pause();
      video2Ref.current.pause();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // Update both videos' current time whenever the state changes while not playing
  useEffect(() => {
    if (!isPlaying) {
      syncTime(currentTime);
    }
  }, [currentTime, isPlaying]);

  return (
    <div className="App">
      <h1>Synchronized Video Players</h1>
      <div className="video-players">
        <video
          ref={video1Ref}
          width="426"
          height="240"
          controls
          onPlay={() => handlePlayPause("play")}
          onPause={() => handlePlayPause("pause")}
          onTimeUpdate={handleSeek}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          ref={video2Ref}
          width="426"
          height="240"
          controls
          onPlay={() => handlePlayPause("play")}
          onPause={() => handlePlayPause("pause")}
          onTimeUpdate={handleSeek}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <h3>Super controls</h3>
      <div className="controls">
        <button onClick={() => handlePlayPause(isPlaying ? "pause" : "play")}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={handleReset}>Reset</button>

        <div className="frame-slider">
          <input type="slider" />
        </div>
      </div>
    </div>
  );
};

export default App;
