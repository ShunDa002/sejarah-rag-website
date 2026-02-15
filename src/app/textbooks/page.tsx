import { TEXTBOOKS } from "@/constants/books";
import Link from "next/link";
import Image from "next/image";

export default function TextbooksPage() {
  // Chunk books into groups of 3 for each shelf
  const shelfChunks = [];
  for (let i = 0; i < TEXTBOOKS.length; i += 3) {
    shelfChunks.push(TEXTBOOKS.slice(i, i + 3));
  }

  return (
    <div className="h-full bg-[#1a0f0a] px-2 pt-4 font-serif sm:px-8 sm:pt-8">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
        <h1
          className="mb-4 text-center text-3xl font-bold text-[#eecfa1] drop-shadow-md sm:mb-8 sm:text-5xl"
          style={{
            textShadow:
              "0px 2px 4px rgba(0, 0, 0, 0.8), 0px 4px 12px rgba(0, 0, 0, 0.6)",
          }}
        >
          Buku Teks Sejarah
        </h1>

        {/* Bookshelf Case */}
        <div className="relative flex-1 overflow-hidden rounded-t-lg border-[12px] border-b-0 border-[#3e2723] bg-[#2d1b14] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,0,0,0.9)] sm:border-[16px]">
          {/* Wood Grain Texture Overlay for the Case */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Scrollable Shelves Container */}
          <div className="relative z-10 h-full w-full overflow-y-auto pb-12 scrollbar-thin scrollbar-track-[#2d1b14] scrollbar-thumb-[#5d4037] hover:scrollbar-thumb-[#4e342e]">
            {shelfChunks.map((chunk, index) => (
              <ShelfRow key={index} books={chunk} />
            ))}

            {/* Empty Shelf Row for visual balance if needed */}
            {shelfChunks.length < 3 && <ShelfRow books={[]} />}
          </div>
        </div>

        {/* Floor Reflection/Shadow */}
        {/* <div className="mx-auto h-12 w-[95%] bg-gradient-to-b from-black/40 to-transparent blur-xl" /> */}
      </div>
    </div>
  );
}

function ShelfRow({ books }: { books: typeof TEXTBOOKS }) {
  return (
    <div className="relative flex min-h-[220px] w-full items-end justify-center px-2 pb-6 pt-6 perspective-[1000px] sm:min-h-[380px] sm:px-12 sm:pb-8 sm:pt-12">
      {/* Back of Shelf Shadow/Gradient (Inner depth) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />

      {/* The Books */}
      <div className="z-10 flex w-full justify-center gap-3 sm:gap-14 md:gap-20">
        {books.map((book) => (
          <div key={book.id} className="group relative [perspective:1000px]">
            <Link
              href={`/textbooks/${book.id}`}
              className="block transition-transform duration-300 group-hover:-translate-y-4 group-hover:scale-105"
            >
              <div className="relative h-[130px] w-[90px] origin-bottom transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-25deg)] sm:h-[280px] sm:w-[200px]">
                {/* Book Cover (Front) */}
                <div className="absolute inset-0 z-20 rounded-r-md bg-white shadow-2xl brightness-95 filter transition-all duration-300 [backface-visibility:hidden] group-hover:brightness-100 group-hover:shadow-[10px_10px_30px_rgba(0,0,0,0.5)]">
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="rounded-r-md object-cover"
                    priority
                  />
                  {/* Spine Highlight (Fake binding) */}
                  <div className="absolute left-0 top-0 h-full w-[4px] bg-gradient-to-r from-white/40 to-transparent opacity-50" />
                  {/* Gloss overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-r-md bg-gradient-to-tr from-white/10 via-transparent to-black/20" />
                </div>

                {/* Book Spine (Left Side) - adjusted to 40px thickness */}
                <div className="absolute left-0 top-0 h-full w-[16px] origin-left -translate-x-[16px] border-r border-white/10 bg-[#5d4037] brightness-90 [transform:rotateY(-90deg)] sm:w-[40px] sm:-translate-x-[40px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden p-1 sm:p-2">
                    <span className="block rotate-90 whitespace-nowrap text-[0.5rem] font-bold tracking-widest text-[#eecfa1] opacity-80 sm:text-xs">
                      {book.title}
                    </span>
                  </div>
                </div>

                {/* Pages (Top) - adjusted to 40px thickness */}
                <div className="absolute left-0 top-0 h-[16px] w-[90px] origin-top -translate-y-[16px] bg-[#fffbf0] shadow-inner [transform:rotateX(90deg)] sm:h-[40px] sm:w-[200px] sm:-translate-y-[40px]" />

                {/* Pages (Right - Thickness) - visible when rotated - adjusted to 40px thickness */}
                <div className="absolute right-0 top-0 h-full w-[16px] origin-right translate-x-[16px] bg-[#fffbf0] shadow-[inset_2px_0_5px_rgba(0,0,0,0.1)] [transform:rotateY(90deg)] sm:w-[40px] sm:translate-x-[40px]">
                  <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,rgba(0,0,0,0.05)_2px)]" />
                </div>
              </div>
            </Link>

            {/* Reflection on Shelf */}
            <div className="absolute -bottom-[10px] left-0 right-0 h-[20px] scale-y-[-1] opacity-20 blur-[2px] mask-image-gradient-to-b">
              {/* Simplified reflection: just a dark blur often looks better than a full flipped image for performance/complexity */}
              <div className="h-full w-full transform rounded-full bg-black/30 blur-md scale-x-90" />
            </div>
          </div>
        ))}
      </div>

      {/* Shelf Floor (The wood plank they sit on) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[16px] bg-[#5D4037] shadow-[0_-5px_10px_rgba(0,0,0,0.3)] sm:h-[24px]">
        {/* Wood texture gradient */}
        <div className="h-full w-full bg-[repeating-linear-gradient(90deg,#5D4037,#5D4037_10px,#4E342E_12px,#5D4037_25px)] opacity-50" />
        {/* Highlight on the edge */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-white/20" />
      </div>

      {/* Shelf Front Face (The thickness of the shelf) */}
      <div className="absolute -bottom-[20px] left-0 right-0 z-20 h-[20px] bg-[#3E2723] shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.6))]" />
      </div>
    </div>
  );
}
