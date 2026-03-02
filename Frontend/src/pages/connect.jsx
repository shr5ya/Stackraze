import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/header/navbar";
import { Map } from "@/components/ui/map";
import MapConnect from "@/components/Connect/MapConnect";
import {
  NearbyUserCard,
  NearbyUserCardSkeleton,
} from "@/components/Connect/NearbyUserCard";
import UpdateLocation from "@/components/Connect/UpdateLocation";
import { API_URL } from "../config/api";

function connect() {
  const [hasLocation, setHasLocation] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rangeKm, setRangeKm] = useState(50);
  const [debouncedRange, setDebouncedRange] = useState(50);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loadingNearbyUsers, setLoadingNearbyUsers] = useState(false);

  // Debounce range changes to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRange(rangeKm);
    }, 500);
    return () => clearTimeout(handler);
  }, [rangeKm]);

  // Fetch nearby users when coordinates or selected range changes
  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        if (!userCoordinates) return;
        setLoadingNearbyUsers(true);
        const token = localStorage.getItem("token");
        const [lng, lat] = userCoordinates;
        const res = await fetch(
          `${API_URL}/user/connect/nearby?lat=${lat}&lng=${lng}&rangeKm=${debouncedRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setNearbyUsers(data.users || []);
        } else {
          console.error("Failed to fetch nearby users");
        }
      } catch (error) {
        console.error("Error fetching nearby users:", error);
      } finally {
        setLoadingNearbyUsers(false);
      }
    };

    fetchNearbyUsers();
  }, [userCoordinates, debouncedRange]);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user/userlocation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (
          data.location &&
          data.location.coordinates &&
          data.location.coordinates.length > 0
        ) {
          setHasLocation(true);
          setUserCoordinates(data.location.coordinates);
        } else {
          setHasLocation(false);
          setUserCoordinates(null);
        }
      } else {
        setHasLocation(false);
        setUserCoordinates(null);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setHasLocation(false);
      setUserCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Sidebar />

      <main className="min-h-screen pt-20 pb-20 px-4">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              Loading...
            </div>
          ) : hasLocation && userCoordinates ? (
            <div className="flex flex-col gap-4 w-full">
              <div className="relative w-full">
                {/* Left fade */}
                <div className="absolute inset-y-0 left-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-neutral-50 dark:from-black to-transparent" />
                {/* Right fade */}
                <div className="absolute inset-y-0 right-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-neutral-50 dark:from-black to-transparent" />
                {/* Top fade */}
                <div className="absolute inset-x-0 top-0 h-4 z-10 pointer-events-none bg-gradient-to-b from-neutral-50 dark:from-black to-transparent" />
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-4 z-10 pointer-events-none bg-gradient-to-t from-neutral-50 dark:from-black to-transparent" />
                <MapConnect
                  userCoordinates={userCoordinates}
                  debouncedRange={debouncedRange}
                  nearbyUsers={nearbyUsers}
                />
              </div>

              {/* Range Selector Tool */}
              <div className="bg-white dark:bg-black p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-200">
                    Search Area
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                    {rangeKm} km
                  </span>
                </div>

                {/* Slider */}
                <div className="flex flex-col gap-1">
                  <input
                    type="range"
                    min="1"
                    max="500"
                    step="1"
                    value={rangeKm}
                    onChange={(e) => setRangeKm(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-[9px] text-neutral-500 px-0.5">
                    <span>1 km</span>
                    <span>500 km</span>
                  </div>
                </div>
              </div>

              {/* Nearby Users List */}
              <div className="w-full mt-4 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 px-1 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  Nearby Users
                </h3>
                <div className="flex flex-col gap-6">
                  {loadingNearbyUsers ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <NearbyUserCardSkeleton key={i} />
                    ))
                  ) : nearbyUsers.length > 0 ? (
                    nearbyUsers.map((user) => (
                      <NearbyUserCard key={user._id} user={user} />
                    ))
                  ) : (
                    <div className="text-center text-neutral-500 py-8 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
                      No users found within {debouncedRange} km.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <UpdateLocation onLocationUpdate={() => fetchLocation()} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default connect;
