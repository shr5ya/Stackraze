import { A, B, C } from "../../assets/about/index";

function AuthPageHero() {
  return (
    <>
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-sky-900/30 dark:via-blue-900/20 dark:to-indigo-900/30 items-center justify-center p-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#0F2854]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4988C4]/20 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="mt-10">
          <div className="flex justify-center relative top-2">
            <img
              src={A}
              alt="Avatar B"
              className="w-20 h-20 bg-cover rounded-full border-4 border-white shadow-lg z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/F9D4D5/333333?text=B";
              }}
            />
            <img
              src={B}
              alt="Avatar C"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg -ml-4 z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/C9E5FF/333333?text=C";
              }}
            />
            <img
              src={C}
              alt="Avatar D"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg -ml-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/FFF5C1/333333?text=D";
              }}
            />
          </div>
          <div className="flex justify-center items-center mt-8 hero-animate">
            <p className="tracking-widest text-4xl font-light text-zinc-800 dark:text-zinc-100">
              Get Started with Algyñ
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthPageHero;
