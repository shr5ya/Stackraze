import React from "react";

function ComingSoon(props) {
  return (
    <div className="flex justify-center items-center flex-col text-center p-2">
      <p className="dark:text-white text-xl lg:text-2xl">{props.message}</p>
      <h1 className="font-extrabold text-zinc-300 text-5xl lg:text-6xl tracking-wider dark:text-zinc-600">
        Coming soon!
      </h1>
    </div>
  );
}

export default ComingSoon;