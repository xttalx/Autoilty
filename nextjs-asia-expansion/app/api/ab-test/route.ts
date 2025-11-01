/**
 * A/B Testing API Route
 * Assigns and tracks variants for homepage A/B test
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVariant, recordVariantAssignment, trackABTestEvent, HOMEPAGE_AB_TEST } from '@/lib/ab-test';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || undefined;
  const sessionId = searchParams.get('sessionId') || undefined;
  const action = searchParams.get('action'); // 'assign' | 'track'

  if (action === 'assign') {
    // Assign variant to user
    const variant = getVariant(userId, sessionId);
    
    return NextResponse.json({
      testId: HOMEPAGE_AB_TEST.testId,
      variant,
      userId,
      sessionId,
    });
  }

  if (action === 'track') {
    // Track event
    const variant = searchParams.get('variant') as any;
    const event = searchParams.get('event') as 'view' | 'click' | 'conversion';
    
    if (!variant || !event) {
      return NextResponse.json(
        { error: 'Missing variant or event' },
        { status: 400 }
      );
    }

    trackABTestEvent(HOMEPAGE_AB_TEST.testId, variant, event);
    
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: 'Invalid action' },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, variant, event, userId, sessionId, metadata } = body;

    if (!testId || !variant || !event) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    trackABTestEvent(testId, variant, event, metadata);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

