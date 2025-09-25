import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with API key (only if available)
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// Simple in-memory storage for demo (use database in production)
const subscribers = new Set<string>();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Welcome email template
const createWelcomeEmail = (email: string) => ({
  from: "Davidson Rafael <hello@davidsonrafael.com>",
  to: [email],
  subject: "Welcome to Davidson Rafael's Newsletter! 🚀",
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to my Newsletter!</h1>
        <p style="color: #6b7280; font-size: 16px;">Thanks for joining the community 🎉</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center;">
        <h2 style="color: white; margin-bottom: 15px;">You're all set!</h2>
        <p style="color: #e5e7eb; margin-bottom: 0;">You'll receive updates about web development, programming tips, and tech insights directly in your inbox.</p>
      </div>
      
      <div style="margin: 25px 0;">
        <h3 style="color: #374151; margin-bottom: 15px;">What to expect:</h3>
        <ul style="color: #6b7280; line-height: 1.6;">
          <li>📝 Latest blog posts about modern web development</li>
          <li>💡 Programming tips and best practices</li>
          <li>🚀 Tech insights and industry updates</li>
          <li>🛠️ Behind-the-scenes of my projects</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://davidsonrafael.com/blog" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
          Read Latest Posts
        </a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 14px;">
        <p>Thanks for subscribing!</p>
        <p><strong>Davidson Rafael</strong><br>
        Web Developer & Tech Writer</p>
        <p style="margin-top: 15px;">
          <a href="https://davidsonrafael.me" style="color: #2563eb;">Website</a> • 
          <a href="https://github.com/davidsonrafael" style="color: #2563eb;">GitHub</a>
        </p>
      </div>
    </div>
  `,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
    }

    // Check if already subscribed
    if (subscribers.has(normalizedEmail)) {
      return NextResponse.json({ message: "This email is already subscribed" }, { status: 409 });
    }

    // Send welcome email using Resend
    try {
      if (!resend) {
        // Fallback: just add to subscribers without sending email
        console.warn("Resend API key not configured. Subscriber added without welcome email.");
        subscribers.add(normalizedEmail);

        return NextResponse.json(
          {
            message: "Successfully subscribed! Welcome to the newsletter.",
            notice: "Email service temporarily unavailable.",
          },
          { status: 200 }
        );
      }

      const emailData = createWelcomeEmail(normalizedEmail);
      const { data, error } = await resend.emails.send(emailData);

      if (error) {
        console.error("Resend API error:", error);
        return NextResponse.json(
          { message: "Failed to send welcome email. Please try again." },
          { status: 500 }
        );
      }

      // Add to subscribers only after successful email send
      subscribers.add(normalizedEmail);

      console.log("Welcome email sent successfully:", data);

      return NextResponse.json(
        {
          message: "Successfully subscribed! Check your email for a welcome message.",
          emailId: data?.id,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Failed to send welcome email. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Get subscription count (for admin/analytics)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const adminKey = url.searchParams.get("key");

  // Simple admin authentication (use proper auth in production)
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    count: subscribers.size,
    subscribers: process.env.NODE_ENV === "development" ? Array.from(subscribers) : undefined, // Don't expose emails in production
  });
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (subscribers.has(normalizedEmail)) {
      subscribers.delete(normalizedEmail);

      // In production, also remove from email service
      /*
      await emailService.unsubscribe(normalizedEmail);
      */

      return NextResponse.json({ message: "Successfully unsubscribed" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Email not found in subscription list" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
