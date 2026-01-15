import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const students = await kv.get('students') || [];
        const settings = await kv.get('settings') || {};
        return NextResponse.json({ students, settings });
    } catch (error) {
        console.error(error);
        // Fallback or empty if KV not set up yet
        return NextResponse.json({ students: [], settings: {} });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { students, settings } = body;

        if (students) await kv.set('students', students);
        if (settings) await kv.set('settings', settings);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save rankings' }, { status: 500 });
    }
}
