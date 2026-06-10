import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
        return NextResponse.json({ error: 'Nenhuma imagem enviada.' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Tipo de arquivo não permitido.' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
        return NextResponse.json({ error: 'A imagem não pode ultrapassar 5 MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.type.split('/')[1].replace('jpeg', 'jpg');
    const filename = `issue_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const dir = path.join(process.cwd(), 'public', 'issues');
    await mkdir(dir, { recursive: true });

    const filepath = path.join(dir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ path: `/issues/${filename}` });
}
