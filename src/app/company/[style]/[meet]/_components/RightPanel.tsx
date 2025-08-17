"use client";
import { useState, useEffect } from "react";
import { ResizablePanel } from "../../../../../components/ui/resizable";
import CountdownTimer from "../../../../../components/CountdownTimer";
import CamScreen from "./CamScreen";
import { Button } from "../../../../../components/ui/button";
import {
  AiLottiePlayer,
  UserLottiePlayer,
} from "@/components/lottie/dotlottie";
import { interviewStore } from "@/lib/utils/interviewStore";
import { useRouter } from "next/navigation";
import { generalStore } from "@/lib/utils/generalStore";

export default function RightPanel({
  minutes,
  seconds,
  setMinutes,
  setSeconds,
  stopConversation,
}: {
  minutes: number;
  seconds: number;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  stopConversation: () => Promise<void>;
}) {
  const router = useRouter();
  const interviewId = generalStore((state) => state.interviewId);
  const { isRecording, aiSpeaking, stopRecording } = interviewStore();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      stopRecording();
    };
  }, [mediaStream, stopRecording]);

  return (
    <ResizablePanel
      defaultSize={25}
      className="flex flex-col h-full bg-white/80 p-4 rounded-lg shadow-lg m-2 backdrop-blur-sm items-center justify-center gap-2"
    >
      <div className="w-full flex justify-center items-center">
        <Button
          onClick={async () => {
            if (mediaStream) {
              mediaStream.getTracks().forEach((track) => track.stop());
            }
            await stopConversation();
            await stopRecording();
            router.push(`/end/${interviewId}`);
          }}
        >
          End Meeting
        </Button>
      </div>

      <CountdownTimer
        minutes={minutes}
        seconds={seconds}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
      />

      <div className="flex rounded-lg shadow-sm p-2 my-4 bg-red-500">
        <CamScreen mediaStream={mediaStream} setMediaStream={setMediaStream} />
      </div>

      {isRecording && (
        <div className="flex justify-center items-center w-full">
          <UserLottiePlayer />
        </div>
      )}
      {aiSpeaking && (
        <div className="flex justify-center items-center w-full">
          <AiLottiePlayer />
        </div>
      )}
    </ResizablePanel>
  );
}
