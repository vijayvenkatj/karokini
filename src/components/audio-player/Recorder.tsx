"use client";
import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, StopCircle, Settings } from "lucide-react";

export const Recorder = () => {
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "disabled"
  >("disabled");
  const [showMicOptions, setShowMicOptions] = useState(false);
  const [permission, setPermission] = useState<PermissionState>("prompt");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const getPermissionState = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setPermission(permissionStatus.state);
      setRecordingState(
        permissionStatus.state === "granted" ? "idle" : "disabled"
      );
      permissionStatus.onchange = () => {
        setPermission(permissionStatus.state);
        setRecordingState(
          permissionStatus.state === "granted" ? "idle" : "disabled"
        );
      };
    } catch (err) {
      console.error("Permission check failed:", err);
    }
  };

  const getMicrophonePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMic ? { deviceId: selectedMic } : true,
      });

      mediaRecorder.current = new MediaRecorder(stream);
    } catch (error) {
      console.error("Microphone permission error:", error);
    }
  };

  const getDeviceDetails = async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const filteredDevices = mediaDevices.filter(
        (device) => device.kind === "audioinput"
      );
      setDevices(filteredDevices);
    } catch (error) {
      console.error("Error fetching device list:", error);
    }
  };

  const startRecording = () => {
    if (!mediaRecorder.current) {
      throw Error("MainRecorder is null");
    }

    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        chunks.current.push(e.data);
      }
    };

    mediaRecorder.current.onerror = (error) => {
      throw Error(error.error);
    };

    try {
      mediaRecorder.current.start();
      setRecordingState("recording");
    } catch (err) {
      console.log(err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder.current) {
      throw Error("Media Recorder is null");
    }
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      console.log("On stop handler");
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
      setRecordingState("idle");
    };
  };

  useEffect(() => {
    getPermissionState();
  }, []);

  useEffect(() => {
    if (permission === "denied" || permission === "prompt") {
      getMicrophonePermissions();
    } else {
      getDeviceDetails();
    }
  }, [permission, selectedMic]);

  useEffect(() => {
    if (devices.length > 0 && !selectedMic) {
      setSelectedMic(devices[0].deviceId);
    }
  }, [devices]);

  const handleRecording = () => {
    if (recordingState === "disabled") return;
    if (recordingState == "idle") {
      console.log("start");
      startRecording();
    } else {
      console.log("Stop");
      stopRecording();
    }
  };

  const toggleMicrophoneState = () => {
    setRecordingState(recordingState === "disabled" ? "idle" : "disabled");
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Recording Button */}
      <button
        onClick={handleRecording}
        disabled={recordingState === "disabled"}
        aria-label={
          recordingState === "recording" ? "Stop recording" : "Start recording"
        }
        className={`
          flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300
          ${
            recordingState === "recording"
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : recordingState === "disabled"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
          }
        `}
      >
        {recordingState === "recording" ? (
          <StopCircle className="h-5 w-5 mr-2" />
        ) : recordingState === "disabled" ? (
          <MicOff className="h-5 w-5 mr-2" />
        ) : (
          <Mic className="h-5 w-5 mr-2" />
        )}
        {recordingState === "recording"
          ? "Stop Recording"
          : recordingState === "disabled"
            ? "Microphone Disabled"
            : "Start Recording"}
      </button>

      {/* Warning if denied */}
      {permission === "denied" && (
        <p className="text-sm text-red-500 mt-1">
          Microphone access is denied. Please allow access in browser settings.
        </p>
      )}

      {/* Microphone Selection */}
      <div className="relative">
        <button
          onClick={() => setShowMicOptions(!showMicOptions)}
          className="flex items-center text-xs px-3 py-1 rounded border border-black dark:border-white text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
        >
          <Settings className="h-3 w-3 mr-1" />
          Select Microphone
        </button>

        {/* Microphone Dropdown */}
        {showMicOptions && (
          <div className="absolute top-full mt-1 w-64 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-10">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Available Microphones
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {devices.map((mic) => (
                <div
                  key={mic.deviceId}
                  onClick={() => {
                    setSelectedMic(mic.deviceId);
                    setShowMicOptions(false);
                  }}
                  className={`
                    p-2 rounded-md cursor-pointer text-sm
                    ${
                      selectedMic === mic.deviceId
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                    }
                  `}
                >
                  {mic.label || `Microphone ${mic.deviceId.slice(0, 5)}...`}
                </div>
              ))}
            </div>

            {/* Toggle microphone enabled/disabled */}
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleMicrophoneState}
                className="w-full text-sm text-left p-2 rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {recordingState === "disabled"
                  ? "Enable Microphone"
                  : "Disable Microphone"}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Audio Preview */}
      {audioBlob && (
        <div className="w-full max-w-md mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recorded Audio Preview
          </h3>
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="w-full rounded"
          />
        </div>
      )}
    </div>
  );
};
