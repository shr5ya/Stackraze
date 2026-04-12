import React, { useState, useEffect } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
} from "@/components/ui/map";
import { MapPin, Navigation } from "lucide-react"; // Added icons for better UI
import { API_URL } from "../../config/api";

function Location() {
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user/userlocation`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.location?.coordinates?.length > 0) {
          setUserCoordinates(data.location.coordinates);
          setLocationDetails(data.location); // Store the whole object (city, state, etc.)
        }
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  if (loading) return <div className="h-96 w-full animate-pulse bg-neutral-100 dark:bg-zinc-900 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Current Location</h2>
        {locationDetails?.city && (
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
            <Navigation size={10} /> {locationDetails.city}, {locationDetails.state}
          </span>
        )}
      </div>
      
      <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
        {userCoordinates ? (
          <Map center={[userCoordinates[1], userCoordinates[0]]} zoom={14}>
            <MapControls position="bottom-right" showZoom />

            <MapMarker longitude={userCoordinates[1]} latitude={userCoordinates[0]}>
              <MarkerContent>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                  <div className="relative flex items-center justify-center size-5 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 shadow-lg" />
                </div>
              </MarkerContent>
              
              <MarkerTooltip>Registry Point</MarkerTooltip>
              
              <MarkerPopup>
                <div className="p-3 min-w-[180px] bg-white dark:bg-zinc-900">
                  <div className="flex flex-col gap-1.5">
                    {/* Place Name Header */}
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 text-blue-500" />
                      <div>
                        <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                          {locationDetails?.placeName || "Pinned Location"}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 capitalize">
                          {locationDetails?.city}, {locationDetails?.state}
                        </p>
                      </div>
                    </div>

                    <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1" />

                    {/* Coordinates Meta */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <span>{userCoordinates[0].toFixed(4)}° N</span>
                      <span>{userCoordinates[1].toFixed(4)}° E</span>
                    </div>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-zinc-400">
            Location data unavailable
          </div>
        )}
      </div>
    </div>
  );
}

export default Location;