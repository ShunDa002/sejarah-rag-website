import Image from "next/image";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Image
        src="/loader.gif"
        alt="Loading..."
        width={64}
        height={64}
        unoptimized
        priority
      />
    </div>
  );
}
