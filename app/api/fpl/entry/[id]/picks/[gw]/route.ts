import { NextResponse } from 'next/server'
import { getEntryPicks } from '@/lib/fpl/cache'
import { getBootstrap } from '@/lib/fpl/cache'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; gw: string }> }) {
  const { id, gw } = await params
  const gwNum = Number(gw)
  const bootstrap = await getBootstrap()
  const gwData = bootstrap.events.find((e) => e.id === gwNum)
  const data = await getEntryPicks(Number(id), gwNum, gwData?.finished ?? false)
  return NextResponse.json(data)
}
