import React from 'react';

function NewsletterSkeleton() {
    return (
        <div className="bg-white dark:bg-[#111318] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-pulse">
            {/* Cover Image Skeleton */}
            <div className="w-full aspect-[16/9] bg-neutral-200 dark:bg-neutral-800" />

            {/* Content */}
            <div className="p-5 sm:p-6">
                {/* Author Row */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                    <div className="flex flex-col gap-1.5">
                        <div className="w-24 h-3.5 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                        <div className="w-36 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                    </div>
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="w-full h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                    <div className="w-3/4 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                </div>

                {/* Summary Skeleton */}
                <div className="space-y-2">
                    <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="w-2/3 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                </div>

                {/* Action Bar Skeleton */}
                <div className="border-t border-neutral-100 dark:border-neutral-800 mt-5 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-8 h-5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="w-8 h-5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        </div>
                        <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsletterSkeleton;
