import { useState, useRef, useEffect } from "react";
import { Card, CardBody, Slider, Button, Image } from "@heroui/react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { songs } from "../data";

export function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex];

  // Robust path resolution for both GitHub Pages and Vercel
  const getAudioPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL || "";
    if (path.startsWith("/")) {
      // Normalize path by removing double slashes
      return `${baseUrl}${path}`.replace(/\/+/g, "/");
    }
    return path;
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      const currentTime = audioRef.current.currentTime;
      if (!isNaN(duration) && duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleProgressChange = (value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      const newTime = (val / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(val);
    }
  };

  return (
    <div className="flex justify-center p-8">
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] w-full"
        shadow="lg"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Album cover"
                className="object-cover rounded-xl"
                height={200}
                shadow="md"
                src={currentSong.cover}
                width="100%"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0">
                  <h3 className="font-semibold text-foreground/90 text-lg">
                    {currentSong.title}
                  </h3>
                  <p className="text-small text-foreground/80">
                    {currentSong.artist}
                  </p>
                </div>
              </div>

              <div className="flex flex-col mt-4 gap-2">
                <Slider
                  aria-label="Music progress"
                  classNames={{
                    track: "bg-default-500/30",
                    thumb: "w-4 h-4 after:w-2 after:h-2 after:bg-foreground",
                  }}
                  color="foreground"
                  value={progress}
                  onChange={handleProgressChange}
                  size="sm"
                />
              </div>

              <div className="flex justify-between items-center w-full mt-4">
                <div className="flex w-full items-center justify-center gap-4">
                  <Button
                    isIconOnly
                    className="data-[hover]:bg-foreground/10"
                    radius="full"
                    variant="light"
                    onPress={prevSong}
                  >
                    <SkipBack className="text-foreground/80" />
                  </Button>
                  <Button
                    isIconOnly
                    className="w-14 h-14 data-[hover]:bg-foreground/10 bg-primary/20"
                    radius="full"
                    variant="light"
                    onPress={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause
                        className="text-primary w-8 h-8"
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        className="text-primary w-8 h-8"
                        fill="currentColor"
                      />
                    )}
                  </Button>
                  <Button
                    isIconOnly
                    className="data-[hover]:bg-foreground/10"
                    radius="full"
                    variant="light"
                    onPress={nextSong}
                  >
                    <SkipForward className="text-foreground/80" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Volume2 className="text-foreground/50 w-5 h-5" />
                <Slider
                  aria-label="Volume"
                  size="sm"
                  color="foreground"
                  value={volume}
                  onChange={(val) =>
                    setVolume(Array.isArray(val) ? val[0] : val)
                  }
                  className="max-w-[120px]"
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <audio
        ref={audioRef}
        src={getAudioPath(currentSong.file)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />
    </div>
  );
}
