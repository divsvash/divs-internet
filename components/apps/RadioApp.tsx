"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Square, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const tracks = [
  { title: "SYSTEM BOOT", artist: "divs.radio", duration: 48, wave: "square" as OscillatorType, notes: [110, 165, 220, 330, 220, 165] },
  { title: "NIGHT DRIVE", artist: "localhost after dark", duration: 64, wave: "sine" as OscillatorType, notes: [130.81, 164.81, 196, 246.94, 196, 164.81] },
  { title: "RABBIT HOLE", artist: "one more tab", duration: 72, wave: "triangle" as OscillatorType, notes: [146.83, 174.61, 220, 293.66, 261.63, 220, 174.61] },
];

function formatTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function RadioApp() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(28);
  const audio = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gain = useRef<GainNode | null>(null);
  const noteTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteIndex = useRef(0);
  const track = tracks[trackIndex];

  function ensureSynth(index = trackIndex) {
    if (!audio.current) audio.current = new AudioContext();
    if (!gain.current) { gain.current = audio.current.createGain(); gain.current.connect(audio.current.destination); }
    gain.current.gain.setTargetAtTime(volume / 500, audio.current.currentTime, 0.03);
    if (oscillator.current) oscillator.current.stop();
    const next = audio.current.createOscillator();
    next.type = tracks[index].wave;
    next.frequency.value = tracks[index].notes[0];
    next.connect(gain.current);
    next.start();
    oscillator.current = next;
    noteIndex.current = 0;
    if (noteTimer.current) clearInterval(noteTimer.current);
    noteTimer.current = setInterval(() => {
      if (!audio.current || !oscillator.current) return;
      noteIndex.current = (noteIndex.current + 1) % tracks[index].notes.length;
      oscillator.current.frequency.setTargetAtTime(tracks[index].notes[noteIndex.current], audio.current.currentTime, 0.05);
    }, 420);
  }

  async function togglePlay() {
    if (!playing) {
      if (!oscillator.current) ensureSynth();
      await audio.current?.resume();
      setPlaying(true);
    } else {
      await audio.current?.suspend();
      setPlaying(false);
    }
  }

  function stop() {
    audio.current?.suspend();
    setPlaying(false); setElapsed(0);
  }

  function chooseTrack(index: number) {
    const wasPlaying = playing;
    setTrackIndex(index); setElapsed(0);
    if (oscillator.current) ensureSynth(index);
    if (wasPlaying) audio.current?.resume();
  }

  function playTrack(index: number) {
    setTrackIndex(index); setElapsed(0);
    ensureSynth(index);
    audio.current?.resume();
    setPlaying(true);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!playing) return;
      setElapsed((current) => current + 1 >= track.duration ? 0 : current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, track.duration]);

  useEffect(() => {
    if (audio.current && gain.current) gain.current.gain.setTargetAtTime(volume / 500, audio.current.currentTime, 0.03);
  }, [volume]);

  useEffect(() => () => {
    if (noteTimer.current) clearInterval(noteTimer.current);
    oscillator.current?.stop();
    audio.current?.close();
  }, []);

  return <div className="radio-app">
    <nav className="window-menu"><span><u>D</u>isc</span><span><u>V</u>iew</span><span><u>O</u>ptions</span><span><u>H</u>elp</span></nav>
    <div className="radio-console">
      <div className="radio-display"><span>[{String(trackIndex + 1).padStart(2, "0")}]</span><strong>{formatTime(elapsed)}</strong><div className={`radio-bars ${playing ? "playing" : ""}`} aria-hidden="true">{[1,2,3,4,5,6,7,8].map((bar) => <i key={bar} />)}</div></div>
      <div className="radio-controls">
        <button className="win95-button" onClick={() => chooseTrack((trackIndex - 1 + tracks.length) % tracks.length)} aria-label="Previous track"><SkipBack size={17} /></button>
        <button className="win95-button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
        <button className="win95-button" onClick={stop} aria-label="Stop"><Square size={16} /></button>
        <button className="win95-button" onClick={() => chooseTrack((trackIndex + 1) % tracks.length)} aria-label="Next track"><SkipForward size={17} /></button>
      </div>
      <div className="radio-fields"><span>Artist:</span><div>{track.artist}</div><span>Title:</span><div>{track.title}</div><span>Track:</span><div>{trackIndex + 1} of {tracks.length} · {formatTime(track.duration)}</div></div>
      <div className="radio-volume"><Volume2 size={17} /><span>Volume</span><Slider value={[volume]} onValueChange={(value) => setVolume(value[0])} min={0} max={100} step={1} aria-label="Volume" /><output>{volume}%</output></div>
    </div>
    <div className="radio-playlist"><div className="playlist-heading"><span>Track</span><span>Title</span><span>Time</span></div>{tracks.map((item, index) => <button className={index === trackIndex ? "selected" : ""} key={item.title} onDoubleClick={() => playTrack(index)} onClick={() => chooseTrack(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><span>{formatTime(item.duration)}</span></button>)}</div>
    <footer className="window-status"><span>{playing ? "Playing local synth" : elapsed ? "Paused" : "Ready"}</span><span>CD Audio</span></footer>
  </div>;
}
