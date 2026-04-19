const PostSkeleton = () => {
  return (

     // Skeleton loader to mimic post layout while data is loading
    <div className="bg-white dark:bg-black dark:border dark:border-zinc-500 rounded-2xl shadow p-4 animate-pulse w-full">


      {/* Header placeholder */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-zinc-700 rounded-full"></div>

          <div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-zinc-700 rounded mb-2"></div>
            <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-500 rounded"></div>
          </div>
        </div>

        <div className="h-4 w-6 bg-gray-300 dark:bg-zinc-700 rounded"></div>
      </div>


      {/* Text Content Placefolder*/}
      <div className="mt-4">
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
      </div>


      {/* Image Placefolder */}
      <div className="mt-4 h-64 bg-gray-300 dark:bg-zinc-700 rounded-xl"></div>


      {/* Actions Placefolder*/}
      <div className="flex gap-6 mt-4">
        <div className="h-6 w-6 bg-gray-300 dark:bg-zinc-700 rounded"></div>
        <div className="h-6 w-6 bg-gray-300 dark:bg-zinc-700 rounded"></div>
        <div className="h-6 w-6 bg-gray-300 dark:bg-zinc-700 rounded"></div>
      </div>


      {/* Comment input Placefolder */}
      <div className="flex items-center gap-3 mt-4">
        <div className="w-8 h-8 bg-gray-300 dark:bg-zinc-700 rounded-full"></div>
        <div className="flex-1 h-10 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
      </div>
    </div>
  );
};


export default PostSkeleton;
