import { kv } from '@vercel/kv';
import Redis from 'ioredis';
import { NextResponse } from 'next/server';

// Fallback to ioredis if Vercel KV tokens are missing but REDIS_URL is present
const getRedisClient = () => {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        return kv;
    }
    if (process.env.REDIS_URL) {
        return new Redis(process.env.REDIS_URL);
    }
    return null;
};

const client = getRedisClient();

export async function GET() {
    try {
        if (!client) return NextResponse.json({ students: [], settings: {} });

        const rawStudents = await client.get('students');
        const rawSettings = await client.get('settings');

        // ioredis returns string, @vercel/kv returns object
        const students = typeof rawStudents === 'string' ? JSON.parse(rawStudents) : (rawStudents || []);
        const settings = typeof rawSettings === 'string' ? JSON.parse(rawSettings) : (rawSettings || {});

        return NextResponse.json({ students, settings });
    } catch (error) {
        console.error('Redis Load Error:', error);
        return NextResponse.json({ students: [], settings: {} });
    }
}

export async function POST(request: Request) {
    try {
        if (!client) return NextResponse.json({ error: 'No Redis client configured' }, { status: 500 });

        const body = await request.json();
        const { students, settings } = body;

        // Determine if we need to stringify (only for standard Redis/ioredis)
        const isStandardRedis = client instanceof Redis;

        if (students) {
            const val = isStandardRedis ? JSON.stringify(students) : students;
            await client.set('students', val as any);
        }

        if (settings) {
            const val = isStandardRedis ? JSON.stringify(settings) : settings;
            await client.set('settings', val as any);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Redis Save Error:', error);
        return NextResponse.json({ error: 'Failed to save rankings' }, { status: 500 });
    }
}
