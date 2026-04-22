import { useState } from "react";
import { MapPin, Navigation, Map, Loader2 } from "lucide-react";
import ThreePeople from "../ThreePeople";

import { usePopup } from "@/context/PopupContext";

const UpdateLocation = ({ onLocationUpdate }) => {
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    city: "",
    state: "",
    country: "",
    placeName: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🌍 Fetch coordinates from city/state/country via Nominatim API
  const fetchCoordinates = async () => {
    const query = `${form.city}, ${form.state}, ${form.country}`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
    );
    const data = await res.json();

    if (!data.length) throw new Error("Location not found");

    return {
      lat: parseFloat(data[0].lat),
      long: parseFloat(data[0].lon),
    };
  };

  // 📍 Get GPS location via browser
  const getGPSLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
          }),
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  };

  const sendToBackend = async (coordinates) => {
    const payload = {
      location: {
        city: form.city,
        state: form.state,
        county: form.country, // Keeping your original 'county' key
        placeName: form.placeName,
        coordinates: [coordinates.long, coordinates.lat], // Fixed: Send as [long, lat] array
      },
    };

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/user/connect/usergeodata`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) throw new Error("Failed to update");
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const coords = await fetchCoordinates();
      await sendToBackend(coords);
      showPopup("Location updated successfully!", "success");
      if (onLocationUpdate) onLocationUpdate();
    } catch (err) {
      console.error(err);
      showPopup(
        "Error finding or updating location. Please check your spelling.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGPS = async () => {
    setLoading(true);

    try {
      // 1. Get GPS Location
      let coords;
      try {
        coords = await getGPSLocation();
      } catch (gpsError) {
        throw new Error(
          `GPS Error: ${"Please turn on location." || gpsError.message || "Permission denied or unavailable"}`,
        );
      }

      // 2. Reverse Geocode (Nominatim)
      let resolvedAddress = { city: "", state: "", country: "", placeName: form.placeName };
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.long}`,
        );
        if (!res.ok) throw new Error("Nominatim API failed");
        const data = await res.json();

        const address = data.address || {};
        resolvedAddress = {
          city: address.city || address.town || address.village || "",
          state: address.state || "",
          country: address.country || "",
          placeName: form.placeName || "",
        };
        // Use functional state update to ensure we have latest state if needed, though 'form' is stable enough here
        setForm((prev) => ({ ...prev, ...resolvedAddress }));
      } catch (geoError) {
        console.warn("Reverse geocoding failed:", geoError);
        // Continue even if geocoding fails, user can manually enter details
      }

      // 3. Send to Backend
      try {
        await sendToBackend(coords, resolvedAddress);
      } catch (backendError) {
        throw new Error(`Backend Error: ${backendError.message}`);
      }

      showPopup("GPS Location updated successfully!", "success");
      if (onLocationUpdate) onLocationUpdate();
    } catch (err) {
      console.error(err);
      showPopup(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <ThreePeople />
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900  border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Update Location
            </h2>
          </div>

          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
            <input
              name="placeName"
              value={form.placeName}
              onChange={handleChange}
              placeholder="Place Name (e.g. Home, Office)"
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-lg px-3 py-2 text-sm outline-none text-neutral-900 dark:text-white transition-colors"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-lg px-3 py-2 text-sm outline-none text-neutral-900 dark:text-white transition-colors"
              />
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-lg px-3 py-2 text-sm outline-none text-neutral-900 dark:text-white transition-colors"
              />
            </div>

            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full bg-neutral-50 dark:bg-neutral-800 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-lg px-3 py-2 text-sm outline-none text-neutral-900 dark:text-white transition-colors"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "Save Location"}
            </button>
          </form>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
            <span className="flex-shrink-0 mx-3 text-xs text-neutral-400 dark:text-neutral-500">
              OR
            </span>
            <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
          </div>

          <button
            onClick={handleGPS}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 py-2.5 rounded-lg transition-colors disabled:opacity-70 font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <span className="text-neutral-500">Locating...</span>
              </div>
            ) : (
              <>
                <Navigation size={16} />
                Use Current Location
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateLocation;
