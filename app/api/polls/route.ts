import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { nanoid } from 'nanoid';
import { Poll } from '@/lib/models';

export async function POST(request: Request) {
    try {
        const { question, options } = await request.json();

        if (!question || !options || options.length < 2) {
            return NextResponse.json(
                { error: 'Question and at least 2 options are required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('poll-db');

        const poll: Poll = {
            shareId: nanoid(10),
            question,
            options: options.map((opt: string) => ({
                id: nanoid(5),
                text: opt,
                votes: 0,
            })),
            createdAt: new Date(),
        };

        await db.collection('polls').insertOne(poll);

        return NextResponse.json({ shareId: poll.shareId });
    } catch (error) {
        console.error('Error creating poll:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}