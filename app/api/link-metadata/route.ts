import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "edge"; // Use edge runtime for better performance

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Validate URL format
    let validatedUrl: URL;
    try {
      validatedUrl = new URL(url);
      if (!["http:", "https:"].includes(validatedUrl.protocol)) {
        throw new Error("Invalid URL protocol");
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Create a fetch request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Fetch the HTML content of the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    const title =
      $("title").text() ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      "";

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[name="twitter:image:src"]').attr("content") ||
      "";

    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    // If favicon is a relative URL, make it absolute
    if (favicon && !favicon.startsWith("http")) {
      const urlObj = new URL(url);
      favicon = new URL(
        favicon,
        `${urlObj.protocol}//${urlObj.host}`
      ).toString();
    }

    const metadata = {
      title,
      description,
      image,
      favicon,
      url,
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching link metadata:", error);

    // Check if it's an abort error (timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 408 });
    }

    return NextResponse.json(
      { error: "Failed to fetch or parse link metadata" },
      { status: 500 }
    );
  }
}
