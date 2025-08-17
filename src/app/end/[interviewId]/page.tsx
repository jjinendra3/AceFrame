"use client";
import { EvaluationDashboard } from "@/components/end/evaluation-dashboard";
import { useEffect, useState } from "react";
export default function Home() {
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvaluation() {
      const pathName = window.location.pathname;
      const interviewId = pathName.split("/").pop();
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewId,
          round: 'google-hr-end'
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch evaluation");
      }
      const data = await response.json();
      if (data.success) {
        setEvaluation(data.data);
      } else {
        setError("Failed to fetch evaluation");
      }
    }
    fetchEvaluation()
      .then(() => {
        console.log("Evaluation fetched successfully");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch evaluation");
      });
    return () => {
      setEvaluation(null);
      setError("");
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-r from-rose-300 via-amber-300 to-amber-200">
      <div className="container mx-auto py-8 px-4">
        <EvaluationDashboard evaluation={evaluation} error={error} />
      </div>
    </main>
  );
}
