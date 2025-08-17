"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CompanyCarousel from "@/components/heroPage/carousel";
import InterviewRoadmap from "@/components/heroPage/roadmap";
import Footer from "@/components/heroPage/footer";
import { generalStore } from "@/lib/utils/generalStore";
import { toaster } from "@/components/toast";

export default function Home() {
  const signout = generalStore((state) => state.logout);
  const loginWithGoogle = generalStore((state) => state.loginWithGoogle);
  const candidate = generalStore((state) => state.candidate);
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-[#FFA09B] ">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            AceFrame
          </motion.div>
          <nav>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link href="/resume" className="text-white text-lg">
                Resume Review
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link href="https://github.com/jjinendra3/aceframe" target="_blank" className="text-white text-lg">
                Code
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              {!candidate ? (
                <Button
                  onClick={async () => {
                    await loginWithGoogle();
                  }}
                  className="text-white text-sm bg-transparent shadow-none"
                >
                  Login
                </Button>
              ) : (
                <Button
                  className="shadow-none bg-transparent text-white"
                  onClick={async () => {
                    try {
                      const res = await signout();
                      if (!res.success) {
                        throw new Error(res.message);
                      }
                      window.location.reload();
                    } catch (error) {
                      toaster(error as string);
                    }
                  }}
                >
                  Signout
                </Button>
              )}
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-custom">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-8"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  Master Tech Interviews with AI
                </h1>
                <p className="text-xl text-white">
                  {
                    "Practice coding interviews in a realistic, live setting with AI. Choose your preferred company's interview style and get personalized feedback to improve your skills."
                  }
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={"/company"}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary hover:bg-secondary"
                    >
                      Start Interview
                    </Button>
                  </Link>
                  {!candidate && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary hover:bg-secondary"
                      onClick={async () => {
                        await loginWithGoogle();
                      }}
                    >
                      Sign Up
                    </Button>
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative h-64 sm:h-80 lg:h-96"
              >
                <Image
                  src="/hero/designer.jpeg"
                  alt="AI Interview Illustration"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>
        <CompanyCarousel />
        <InterviewRoadmap />
      </main>
      <Footer />
    </div>
  );
}
