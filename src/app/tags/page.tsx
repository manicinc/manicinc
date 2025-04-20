// src/app/tags/[tag]/page.tsx
import Link from "next/link";

// This function is crucial for Next.js 15 types
export default async function TagPage(props: any) {
  // Await the params to satisfy Next.js 15
  const params = await props.params;
  const { tag } = params;

  return (
    <main className="container mx-auto p-5">
      <h1 className="text-2xl font-bold">Tag: {tag}</h1>
      
      <div className="mt-5">
        <Link href="/blog" className="text-blue-500 hover:underline">
          ← Back to blog
        </Link>
      </div>
    </main>
  );
}