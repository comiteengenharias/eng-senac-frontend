import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const folder = (formData.get('folder') as string | null) ?? 'evaluations';

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
    const filename = `${folder}/eval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${extension}`;

    await s3.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
    }));

    const url = `${process.env.R2_PUBLIC_URL}/${filename}`;
    return NextResponse.json({ path: url });
}
