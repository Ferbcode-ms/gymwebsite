import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyAdminAuth } from "@/lib/cms/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(request: Request) {
  try {
    // 1. Authorize admin
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized: admin login required" },
        { status: 401 }
      );
    }

    // 2. Extract and validate file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type (${file.type}). Supported formats: JPG, PNG, WebP, AVIF, GIF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 10MB limit. Please upload a smaller image.",
        },
        { status: 400 }
      );
    }

    // 3. Convert file to base64 buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // 4. Upload to Cloudinary folder "gymwebsite"
    const uploadResult = await uploadToCloudinary(base64Data, "gymwebsite");

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image to Cloudinary",
      },
      { status: 500 }
    );
  }
}
