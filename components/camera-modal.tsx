"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Camera } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: () => void
  productImage: string
  productName: string
}

export default function CameraModal({ isOpen, onClose, onCapture, productImage, productName }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permissionError, setPermissionError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Only set up camera when modal is opened, not on component mount
  useEffect(() => {
    if (isOpen) {
      // Don't auto-start camera, wait for user to click button
      setIsLoading(true)
      setPermissionError(false)
    } else {
      // Clean up when modal closes
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    setIsLoading(true)
    setPermissionError(false)

    try {
      // Explicitly request camera with user gesture context
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use front camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((error) => {
            console.error("Error playing video:", error)
            setPermissionError(true)
          })
        }
        setStream(mediaStream)
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error)
      setPermissionError(true)
      setIsLoading(false)

      // Show more specific error message based on the error
      let errorMessage = "Unable to access your camera. Please check your browser permissions."
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "Camera access was denied. Please allow camera access in your browser settings."
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "No camera found on your device."
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "Your camera is already in use by another application."
      }

      toast({
        title: "Camera Access Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    // Also clear the video element source
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const handleCapture = () => {
    onCapture()
    stopCamera()
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Virtual Try-On Camera</h3>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4">
          {permissionError ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium">Camera Access Denied</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                We couldn't access your camera. This could be due to browser permissions or your device settings.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Try these options:</p>
                  <ul className="text-sm text-left list-disc pl-6 mb-4 space-y-1">
                    <li>Check your browser's camera permissions in settings</li>
                    <li>Make sure no other application is using your camera</li>
                    <li>Try using a different browser</li>
                    <li>Restart your browser and try again</li>
                  </ul>
                </div>
                <Button variant="default" onClick={startCamera}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : isLoading && !stream ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground mb-6">Preparing camera...</p>
              <Button onClick={startCamera} disabled={stream !== null}>
                Start Camera
              </Button>
            </div>
          ) : (
            <>
              <div className="relative max-w-md mx-auto">
                {!stream && (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Button size="lg" onClick={startCamera} className="flex items-center gap-2">
                      <Camera className="h-5 w-5" /> Start Camera
                    </Button>
                  </div>
                )}

                {stream && (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-auto rounded-lg border-2 border-primary"
                      autoPlay
                      playsInline
                      muted
                    ></video>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="relative w-40 h-60">
                        <Image
                          src={productImage || "/placeholder.svg"}
                          alt={productName}
                          fill
                          className="object-contain opacity-70"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {stream && (
                <>
                  <p className="text-muted-foreground text-center mt-4 mb-6">
                    Position yourself in the frame to see how the item looks on you.
                  </p>

                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleCapture}>Capture</Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
