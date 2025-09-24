import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Blog Post";
    const category = searchParams.get("category");
    const author = searchParams.get("author") || "Davidson Rafael";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "80px",
              maxWidth: "900px",
              position: "relative",
            }}
          >
            {/* Category badge */}
            {category && (
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "18px",
                  fontWeight: "500",
                  marginBottom: "20px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {category}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "800",
                color: "white",
                lineHeight: "1.1",
                marginBottom: "30px",
                textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                textAlign: "center",
              }}
            >
              {title}
            </h1>

            {/* Author */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                {author.charAt(0).toUpperCase()}
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "500",
                }}
              >
                {author}
              </div>
            </div>
          </div>

          {/* Logo/Brand */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            Blog
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      console.log(`Failed to generate image: ${message}`);
    }
    return new Response("Failed to generate image", { status: 500 });
  }
}
