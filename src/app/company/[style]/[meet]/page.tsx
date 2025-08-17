"use client";

import { useState, useEffect, useCallback } from "react";
import LeftPanel from "./_components/LeftPanel";
import RightPanel from "./_components/RightPanel";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { generalStore } from "@/lib/utils/generalStore";
import { toaster } from "@/components/toast";
import { useRouter } from "next/navigation";
import { interviewStore } from "@/lib/utils/interviewStore";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState(
    '#include<iostream>\nusing namespace std;\n\nint main(){\n\tcout<<"Hello World";\n}'
  );
  const question = ''
  // const [question, setQuestion] = useState("");
  const interviewId = generalStore((state) => state.interviewId)
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const mins = interviewStore((state) => state.minutes);
  const secs = interviewStore((state) => state.seconds);
  const candidate = generalStore((state) => state.candidate);
  if (!candidate) {
    toaster("Please Login to start the meet.");
  }

  const stopConversation = useCallback(async () => {
    // await conversation.endSession();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toaster("You are not allowed to switch tabs.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (mins === "00" && secs === "00") {
      stopConversation();
      router.push(`/end/${interviewId}`);
    }
  }, [mins, secs, router, stopConversation, interviewId]);

  useEffect(() => {
    if (!candidate) {
      toaster("Please Login to start the meet.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }
  }, [candidate, router]);

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-[#FFE6C9] to-[#FFA09B]">
      <ResizablePanelGroup direction="horizontal">
        <LeftPanel code={code} setCode={setCode} question={question} />
        <RightPanel
          minutes={minutes}
          seconds={seconds}
          setMinutes={setMinutes}
          setSeconds={setSeconds}
          stopConversation={stopConversation}
        />
      </ResizablePanelGroup>
    </div>
  );
}
