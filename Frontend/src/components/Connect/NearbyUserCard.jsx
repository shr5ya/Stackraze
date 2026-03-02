import React from 'react';
import { resolveAvatar } from "../../utils/avatarHelper";

export function NearbyUserCard({ user }) {
    const isDefaultUiAvatar = user.avatar && user.avatar.includes("ui-avatars.com");
    const assignedAvatar = isDefaultUiAvatar ? user.avatar : resolveAvatar(user.avatar);

    return (
        <div className="bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 w-full flex flex-col pt-12 relative mt-10">
            {/* Avatar placed at the top overlapping the border */}
            <div className="absolute -top-10 left-4">
                <div className="relative size-20 rounded-full overflow-hidden border-4 border-white dark:border-black shadow-sm bg-neutral-100 dark:bg-neutral-900">
                    <img
                        src={assignedAvatar}
                        alt={user.name || "User Avatar"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = resolveAvatar(`Avatar1`);
                        }}
                    />
                </div>
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{user.name}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">@{user.username}</p>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />

            <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">About</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {user.about || "No info provided."}
                </p>
            </div>
        </div>
    );
}

export function NearbyUserCardSkeleton() {
    return (
        <div className="bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 w-full flex flex-col pt-12 relative mt-10">
            <div className="absolute -top-10 left-4">
                <div className="size-20 rounded-full border-4 border-white dark:border-black shadow-sm bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            </div>

            <div className="mb-4 space-y-2">
                <div className="h-6 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />

            <div className="space-y-2">
                <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
        </div>
    );
}
