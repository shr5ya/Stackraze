import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ComingSoon from "@/components/ComingSoon";
import SettingsOptions from "@/components/settings/options";
import UpdateLocation from "@/components/Connect/UpdateLocation";
import EditProfileModal from "@/components/profile/EditProfileModal";
import Location from "@/components/settings/Location";
import { ArrowBigLeft } from "lucide-react"
import DeleteAccountButton from "@/components/settings/DeleteAccountButton";

function Settings() {
  const { tab } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const renderContent = () => {
    const currentTab = tab || "update-account-data";

    switch (currentTab.toLowerCase()) {
      case "update-location":
        return (
          <div className="flex flex-col gap-4">
            <Location />
            <hr className="border-neutral-200 dark:border-neutral-800" />
            <UpdateLocation />
          </div>
        );

      case "update-account-data":
        return <div>
          <EditProfileModal inline={true} />
          <DeleteAccountButton/>
          </div>;

      case "story":
        return <ComingSoon message="Story Settings" />;

      case "people":
        return <ComingSoon message="People Settings" />;

      case "newsroom":
        return <ComingSoon message="Newsroom Settings" />;

      default:
        return (
          <ComingSoon
            message={`${currentTab.replace("-", " ")} Settings`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black relative">
      <SettingsOptions />

      <main className="min-h-screen md:pt-20 pb-20 px-4">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6 mt-6 md:mt-0 lg:mt-6">

          <div className=" min-h-[60vh] p-6 pt-0 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md">
                {renderContent()}
              </div>
            </div>

          </div>
          <div className="fixed bottom-4 left-4 z-50 md:hidden">
            <Link
              to="/"
              className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-full px-4 py-2 shadow-md active:scale-95 transition"
            >
              <ArrowBigLeft size={16} />
              <span className="text-sm font-medium">Go back</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;

