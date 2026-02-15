import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const shareId = params.id;

    try {
        const client = await clientPromise;
        const db = client.db('poll-db');

        const poll = await db.collection('polls').findOne({ shareId });

        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
        }

        return NextResponse.json(poll);
    } catch (error) {
        console.error('Error fetching poll:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}