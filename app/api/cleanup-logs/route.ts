import { NextRequest , NextResponse} from 'next/server';
import { cleanupOldLogs , logger } from '@/lib/services/logging/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let authHeader = request.headers.get('authorization');
  const expectedAuth = process.env.CRON_SECRET;

  if (authHeader?.startsWith('Bearer ')) {
    authHeader = authHeader.slice(7);
  }

  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    cleanupOldLogs();
    logger.info({
      message: 'Cleanup logs cron job triggered and completed successfully',
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error({
      message: 'Cleanup logs cron job error',
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    )
  }
}
