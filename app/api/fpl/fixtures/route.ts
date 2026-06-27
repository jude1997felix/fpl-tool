import { NextResponse } from 'next/server'
import { getFixtures } from '@/lib/fpl/cache'
import { getBootstrap } from '@/lib/fpl/cache'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const gw = Number(searchParams.get('event') ?? 1)
  const bootstrap = await getBootstrap()
  const gwData = bootstrap.events.find((e) => e.id === gw)
  const data = await getFixtures(gw, gwData?.finished ?? false)
  return NextResponse.json(data)
}
