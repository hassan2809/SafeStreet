import React, { useState, useEffect } from "react";
import { getActiveAds } from "../../api/adsService";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const Advertisement = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getActiveAds();
        const activeAds = data.filter(
          (ad) =>
            ad.active &&
            (!ad.expiryDate || new Date(ad.expiryDate) > new Date())
        );
        setAdvertisements(activeAds);
      } catch (err) {
        setError(err.message || "Failed to fetch advertisements");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (advertisements.length <= 1) return;
    
    // Auto-slide every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === advertisements.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === advertisements.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? advertisements.length - 1 : prev - 1
    );
  };

  // If there are no ads, don't render anything
  if (loading && advertisements.length === 0 && !error) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      <Card className="border-none shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent z-10 p-4">
              <h2 className="text-xl font-semibold text-white">
                Featured Offers
              </h2>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <div className="space-y-4 w-full px-8">
                  <Skeleton className="h-6 w-2/3 mx-auto" />
                  <Skeleton className="h-72 w-full rounded-lg" />
                </div>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Carousel */}
            {!loading && advertisements.length > 0 && (
              <div className="relative w-full h-96">
                {/* Carousel Wrapper */}
                <div className="relative h-full overflow-hidden">
                  {advertisements.map((ad, index) => (
                    <div
                      key={ad._id}
                      className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
                        index === currentSlide 
                          ? "opacity-100 translate-x-0" 
                          : index < currentSlide 
                            ? "opacity-0 -translate-x-full" 
                            : "opacity-0 translate-x-full"
                      }`}
                      onClick={() => ad.link && window.open(ad.link, "_blank")}
                    >
                      {ad.mediaType === "image" ? (
                        <img
                          src={ad.mediaUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/1200/500";
                            e.target.alt = "Image not available";
                          }}
                        />
                      ) : ad.mediaType === "video" ? (
                        <video
                          controls
                          className="w-full h-full object-cover"
                          poster="/api/placeholder/1200/500"
                        >
                          <source src={ad.mediaUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No media available</span>
                        </div>
                      )}
                      
                      {/* Ad Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                        <h3 className="text-xl font-bold">{ad.title}</h3>
                        {ad.description && (
                          <p className="mt-2 line-clamp-2">{ad.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider Controls */}
                {advertisements.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute top-1/2 left-4 z-30 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-colors focus:outline-none"
                      onClick={prevSlide}
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                      <span className="sr-only">Previous</span>
                    </button>
                    <button
                      type="button"
                      className="absolute top-1/2 right-4 z-30 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 transition-colors focus:outline-none"
                      onClick={nextSlide}
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                      <span className="sr-only">Next</span>
                    </button>
                  </>
                )}

                {/* Slider indicators */}
                {advertisements.length > 1 && (
                  <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
                    {advertisements.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSlide ? "bg-white" : "bg-white/50"
                        }`}
                        aria-current={index === currentSlide ? "true" : "false"}
                        onClick={() => setCurrentSlide(index)}
                      ></button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Advertisement;