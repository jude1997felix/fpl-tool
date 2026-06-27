import { NextResponse } from 'next/server'
import { getBootstrap } from '@/lib/fpl/cache'

export async function GET() {
  const data = await getBootstrap()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' },
  })
}
