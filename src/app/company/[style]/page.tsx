"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCircle, Code } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { generalStore } from "@/lib/utils/generalStore";
import { toast } from "sonner";
import { interviewStore } from "@/lib/utils/interviewStore";

const interviewTypes = [
  {
    code: "hr",
    name: "HR Interview",
    icon: UserCircle,
    description: "Practice your soft skills and behavioral questions",
  },
  {
    code: "dsa",
    name: "DSA Interview",
    icon: Code,
    description: "Tackle coding challenges and algorithm problems",
  },
];

export default function ChooseInterviewType() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const candidate = generalStore((state) => state.candidate);
  const introduction = interviewStore((state) => state.startInterview)
  if (
    !(
      pathname.split("/")[2] == "meta" ||
      pathname.split("/")[2] == "google" ||
      pathname.split("/")[2] == "apple" ||
      pathname.split("/")[2] == "amazon" ||
      pathname.split("/")[2] == "netflix" ||
      pathname.split("/")[2] == "nvidia"
    )
  ) {
    router.push("/company");
    return;
  }
  return (
    <div className="h-screen w-full bg-gradient-custom flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose Your Interview Type
      </motion.h1>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
        {interviewTypes.map((type, index) => (
          <motion.button
            key={type.name}
            className={`bg-white rounded-lg p-6 flex flex-col items-center justify-center transition-all ${selectedType === type.code ? "ring-4 ring-primary" : ""
              }`}
            onClick={() => setSelectedType(type.code)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <type.icon className="w-16 h-16 mb-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {type.name}
            </h2>
            <p className="text-center text-muted-foreground">
              {type.description}
            </p>
          </motion.button>
        ))}
      </div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!selectedType || selectedType === 'dsa'}
          onClick={async () => {
            if (!candidate) {
              router.push("/");
              toast.error("Please login to start interview");
              return;
            }
            const load = toast.loading("Loading Interview...");
            try {
              const roundParam = `${pathname.split("/")[2]}-${selectedType}`;
              const response = await introduction(roundParam);
              if (!response.success) {
                throw new Error("Failed to start interview");
              }

              router.push(`/company/${roundParam}/${response.id}`);
              toast.success("Lets Go!🚀", {
                id: load,
              });
            } catch {
              toast.error("Failed to start interview", {
                id: load,
              });
              router.push("/");
            }
          }}
        >
          Start Interview
        </Button>
      </motion.div>
      <motion.div
        className="absolute top-4 left-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/company">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            &larr; Back to Company Selection
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
