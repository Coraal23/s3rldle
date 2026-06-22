import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full ">
      <div className="flex flex-1 justify-between shadow-md shadow-white">
        <div className="flex flex-1 justify-between items-center max-w-[80%] mx-auto">
          <Image
            className="cursor-pointer"
            src="/s3rldlelogo.png"
            alt="Next.js logo"
            width={220}
            height={80}
            priority
          />
          <button className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:border-white/0">
            <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />

            <span className="relative z-10 flex items-center gap-2 text-white text-xl cursor-pointer transition-colors duration-300 group-hover:text-black">
              <span className="flex items-end gap-[2px] h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="w-[3px] bg-current animate-[eq1_0.6s_ease-in-out_infinite]" />
                <span className="w-[3px] bg-current animate-[eq2_0.6s_ease-in-out_infinite]" />
                <span className="w-[3px] bg-current animate-[eq3_0.6s_ease-in-out_infinite]" />
              </span>
              Ver días anteriores
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
