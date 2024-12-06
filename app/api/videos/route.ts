import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all videos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const videos = await prisma.video.findMany({
      where: category && category !== 'All' ? {
        category: category
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST new video
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, thumbnail, duration, category, url } = body;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        thumbnail,
        duration,
        category,
        url
      }
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}
