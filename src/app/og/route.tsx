import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Davidson Rafael Portfolio";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          fontSize: 60,
          fontWeight: "bold",
          color: "black",
          padding: "40px",
          textAlign: "center",
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
