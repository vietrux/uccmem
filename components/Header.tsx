import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-[#ffd01a] border-b-2 border-black py-3 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image 
              src="/logo.webp" 
              alt="USTH Coders Club Logo" 
              width={32} 
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">USTH Coders Club</span>
        </Link>
      </div>
    </header>
  );
}