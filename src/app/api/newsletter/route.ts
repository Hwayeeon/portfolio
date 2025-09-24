import { NextRequest, NextResponse } from "next/server";

// In production, you would integrate with services like:
// - ConvertKit
// - Mailchimp
// - SendGrid
// - Resend
// - Buttondown

interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
  source: string;
}

// Simple in-memory storage for demo (use database in production)
const subscribers = new Set<string>();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Add to subscribers (in production, save to database)
    subscribers.add(normalizedEmail);

    // In production, you would integrate with your email service here:
    /*
    try {
      await emailService.subscribe({
        email: normalizedEmail,
        tags: ['website-signup'],
        customFields: {
          source: 'website',
          subscribedAt: new Date().toISOString(),
        }
      });
    } catch (emailServiceError) {
      console.error('Email service error:', emailServiceError);
      // Remove from local storage if email service fails
      subscribers.delete(normalizedEmail);
      return NextResponse.json(
        { message: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }
    */

    // Log subscription (in production, use proper logging)
    console.log(`New newsletter subscription: ${normalizedEmail}`);

    // Send welcome email (in production)
    /*
    await emailService.sendTransactional({
      to: normalizedEmail,
      template: 'welcome',
      subject: 'Welcome to Davidson Rafael\'s Newsletter!',
      data: {
        unsubscribeUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(normalizedEmail)}`,
      }
    });
    */

    return NextResponse.json(
      {
        message: "Successfully subscribed! Welcome to the newsletter.",
        success: true,
      },
      { status: 200 }
    );
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
