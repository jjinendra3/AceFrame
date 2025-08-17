import { decode } from "base64-arraybuffer";

export function convertBase64ToAudioWithPackage(base64String: string): Blob {
  const base64Data = base64String.includes("base64,")
    ? base64String.split("base64,")[1]
    : base64String;

  const arrayBuffer = decode(base64Data);

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
