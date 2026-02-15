import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Vote } from '@/lib/models';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const shareId = params.id;
    const { optionId, fingerprint } = await request.json();

    if (!optionId || !fingerprint) {
        return NextResponse.json(
            { error: 'Option ID and fingerprint are required' },
            { status: 400 }
        );
    }

    const forwarded = request.headers.get('input-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    try {
        const client = await clientPromise;
        const db = client.db('poll-db');

        const poll = await db.collection('polls').findOne({ shareId });
        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
        }

        const existingVote = await db.collection('votes').findOne({
            pollId: shareId,
            $or: [{ ip }, { fingerprint }],
        });

        if (existingVote) {
            return NextResponse.json(
                { error: 'You have already voted on this poll' },
                { status: 403 }
            );
        }

        const vote: Vote = {
            pollId: shareId,
            optionId,
            ip,
            fingerprint,
            createdAt: new Date(),
        };

        await db.collection('votes').insertOne(vote);

        await db.collection('polls').updateOne(
            { shareId, 'options.id': optionId },
            { $inc: { 'options.$.votes': 1 } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error recording vote:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}