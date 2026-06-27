import { NextResponse } from 'next/server'
import { fetchEntry } from '@/lib/fpl/api'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchEntry(Number(id))
  return NextResponse.json(data)
}
