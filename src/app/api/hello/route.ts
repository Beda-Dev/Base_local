import { NextResponse } from 'next/server'

const message = "Bonjour ! Bienvenue sur l'API"

const timestamp = new Date().toString()


export async function GET() {
  return NextResponse.json({
    message,
    timestamp,
  })
}

export async function POST(request: Request) {
  const data = await request.json()
  return NextResponse.json({
    message: 'Données reçues avec succès',
    received: data
  })
}

