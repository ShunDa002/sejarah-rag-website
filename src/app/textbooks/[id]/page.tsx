import { TEXTBOOKS } from "@/constants/books";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TextbookReaderPage({ params }: PageProps) {
  const { id } = await params;
  const book = TEXTBOOKS.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm z-10 sticky top-0">
        <Link 
          href="/textbooks" 
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Bookshelf
        </Link>
        <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
            {book.title}
            </h1>
        </div>
        <div className="w-24" /> {/* Spacer for centering */}
      </header>
      
      <main className="flex-1 w-full h-full p-4 overflow-hidden relative">
        <div className="absolute inset-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <iframe
            src={book.pdfUrl}
            className="w-full h-full border-0"
            title={`Reader: ${book.title}`}
            allow="fullscreen"
            />
        </div>
      </main>
    </div>
  );
}
