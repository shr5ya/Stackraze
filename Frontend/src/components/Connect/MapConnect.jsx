import React, { useState, useEffect, useRef } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
} from "@/components/ui/map";
import { MapPin } from "lucide-react";
import { resolveAvatar } from "../../utils/avatarHelper";
import { API_URL } from "../../config/api";

const theme = localStorage.getItem("theme");

function MapConnect({ userCoordinates, debouncedRange, nearbyUsers = [] }) {
  const mapRef = useRef(null);

  // Adjust map zoom based on selected range
  useEffect(() => {
    if (mapRef.current) {
      let newZoom;
      if (debouncedRange <= 5) newZoom = 13;
      else if (debouncedRange <= 10) newZoom = 12;
      else if (debouncedRange <= 25) newZoom = 11;
      else if (debouncedRange <= 50) newZoom = 9;
      else if (debouncedRange <= 100) newZoom = 8;
      else if (debouncedRange <= 250) newZoom = 7;
      else newZoom = 6;

      mapRef.current.flyTo({ center: [userCoordinates[1], userCoordinates[0]], zoom: newZoom, duration: 1000 });
    }
  }, [debouncedRange, userCoordinates]);

  // If no userCoordinates, we can just return null or a message, but parent component ensures it's present.
  if (!userCoordinates) return null;

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
      <Map ref={mapRef} center={[userCoordinates[1], userCoordinates[0]]} zoom={9}>
        {nearbyUsers.map((user, index) => {
          // Check if user has the default mongoose avatar or no avatar
          const isDefaultUiAvatar = user.avatar && user.avatar.includes("ui-avatars.com");

          let assignedAvatar;
          if (isDefaultUiAvatar) {
            // Fallback to local import dynamically if needed, or stick to ui-avatars.
            assignedAvatar = user.avatar;
          } else {
            assignedAvatar = resolveAvatar(user.avatar);
          }

          return (
            <MapMarker
              key={user._id}
              longitude={user.location.coordinates[1]}
              latitude={user.location.coordinates[0]}
            >
              <MarkerContent>
                <div className="relative group cursor-pointer hover:scale-110 transition-transform duration-200">
                  {/* Ping animation behind avatar */}
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping group-hover:animate-none" />

                  {/* Avatar container */}
                  <div className="relative size-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center">
                    <img
                      src={assignedAvatar}
                      alt={user.name || "User Avatar"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Safe fallback if local image fails
                        e.target.src = resolveAvatar(`Avatar${(index % 5) + 1}`);
                      }}
                    />
                  </div>
                </div>
              </MarkerContent>

              <MarkerTooltip>{user.name || user.username}</MarkerTooltip>

              <MarkerPopup>
                <div className="p-1 min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={assignedAvatar}
                      alt={user.name || "User"}
                      className="size-12 rounded-full border shadow-sm object-cover"
                      onError={(e) => { e.target.src = resolveAvatar(`Avatar${(index % 5) + 1}`); }}
                    />
                    <div className="text-center">
                      <p className="font-semibold text-sm leading-tight text-neutral-900 dark:text-neutral-100">{user.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">@{user.username}</p>
                    </div>

                    {user.location.placeName && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                        <MapPin className="size-3" />
                        <span className="truncate max-w-[120px]">{user.location.placeName || user.location.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })
        }
        <MapControls
  className="w-8 text-neutral-700 dark:text-neutral-200"
  position="bottom-right"
  showZoom
  showCompass
  showFullscreen
/>

        {/* special marker for the current user */}
        <MapMarker
          longitude={userCoordinates[1]}
          latitude={userCoordinates[0]}
        >
          <MarkerContent>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" />
              <div className="relative flex items-center justify-center size-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 border-2 border-white shadow-xl hover:scale-110 transition-transform duration-200">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </MarkerContent>
          <MarkerTooltip>You are here</MarkerTooltip>
          <MarkerPopup>
            <div className="space-y-1">
              <p className="font-medium">You</p>
            </div>
          </MarkerPopup>
        </MapMarker>
      </Map >
    </div >
  );
}

export default MapConnect;
