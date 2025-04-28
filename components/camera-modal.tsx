"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: () => void;
  productImage: string;
  productName: string;
}

export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
  productImage,
  productName,
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [simulationMode, setSimulationMode] = useState(true);

  const isPreviewEnvironment = () => {
    if (typeof window === "undefined") return true;
    return (
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost"
    );
  };

  const startCamera = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) {
      console.log("Not in a browser environment or mediaDevices not available");
      setSimulationMode(true);
      setIsLoading(false);
      return;
    }

    if (isPreviewEnvironment()) {
      console.log("Preview environment detected, using simulation mode");
      setSimulationMode(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setPermissionError(false);
    setErrorMessage("");
    setCameraActive(false);
    setSimulationMode(false);

    try {
      let mediaStream: MediaStream;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        console.log("Failed with ideal constraints, trying minimal constraints");
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setStream(mediaStream);
        setCameraActive(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Camera access error:", error);

      let message = "Unable to access your camera. Please check your browser permissions.";

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        message = "Camera access was denied. Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError") {
        message = "No camera was found on your device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        message = "Your camera is already in use by another application.";
      } else if (error.name === "OverconstrainedError") {
        message = "No camera matching the requested constraints was found.";
      } else if (error.name === "TypeError" || error.message === "Your browser doesn't support camera access") {
        message = "Your browser doesn't support camera access.";
      }

      setErrorMessage(message);
      setPermissionError(true);
      setIsLoading(false);
      setSimulationMode(true);

      toast({
        title: "Using Simulation Mode",
        description: "Camera access is not available. Using simulation mode instead.",
        duration: 3000,
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      timer = setTimeout(() => {
        startCamera();
      }, 300);
    } else {
      stopCamera();
    }

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen]);

  const handleCapture = () => {
    onCapture();
    stopCamera();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {simulationMode ? "Virtual Try-On (Simulation)" : "Virtual Try-On Camera"}
          </h3>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4">
          {permissionError && !simulationMode ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium">Camera Access Error</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                {errorMessage || "We couldn't access your camera. This could be due to browser permissions or your device settings."}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="secondary" onClick={() => setSimulationMode(true)}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Use Simulation Mode
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Preparing try-on experience...</p>
            </div>
          ) : simulationMode ? (
            <>
              <div className="relative max-w-md mx-auto">
                <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ minHeight: "400px" }}>
                  <div className="relative w-full h-[400px]">
                    <Image
                      src="/placeholder.svg?height=400&width=300&text=Virtual+Try-On"
                      alt="Virtual try-on simulation"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-72 bg-gray-800/50 rounded-full"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="relative w-40 h-60">
                        <Image
                          src={productImage || "/placeholder.svg"}
                          alt={productName || "Product"}
                          fill
                          className="object-contain opacity-70"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded-md mt-4 mb-2 text-sm">
                <p className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span>
                    <strong>Simulation Mode:</strong> Camera access is not available. This is a simulated preview.
                  </span>
                </p>
              </div>

              <p className="text-muted-foreground text-center mb-6">Adjust yourself and see how it looks on you.</p>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleCapture}>
                  Capture
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="relative max-w-md mx-auto">
                <div className="bg-black rounded-lg overflow-hidden" style={{ minHeight: "300px" }}>
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                </div>

                {cameraActive && productImage && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="relative w-40 h-60">
                      <Image
                        src={productImage || "/placeholder.svg"}
                        alt={productName || "Product"}
                        fill
                        className="object-contain opacity-70"
                      />
                    </div>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground text-center mt-4 mb-6">
                Adjust yourself and see how it looks on you.
              </p>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleCapture} disabled={!cameraActive}>
                  Capture
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
