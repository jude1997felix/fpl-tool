import { NextResponse } from 'next/server'
import { getEntryHistory } from '@/lib/fpl/cache'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getEntryHistory(Number(id))
  return NextResponse.json(data)
}
