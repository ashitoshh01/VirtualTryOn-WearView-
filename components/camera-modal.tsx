"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Camera, RefreshCw } from "lucide-react"
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
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    setIsLoading(true)
    setPermissionError(false)
    setErrorMessage("")
    setCameraActive(false)

    try {
      // Check if navigator.mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser")
      }

      // Request camera access with lower constraints first
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      // Set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)

        // Handle successful video loading
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setCameraActive(true)
                setIsLoading(false)
              })
              .catch((error) => {
                console.error("Error playing video:", error)
                setErrorMessage("Could not play the video stream. Please try again.")
                setIsLoading(false)
                setPermissionError(true)
              })
          }
        }
      } else {
        throw new Error("Video element not found")
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error)

      // Handle different error types
      let message = "Unable to access your camera. Please check your browser permissions."

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        message = "Camera access was denied. Please allow camera access in your browser settings."
      } else if (error.name === "NotFoundError") {
        message = "No camera was found on your device."
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        message = "Your camera is already in use by another application."
      } else if (error.name === "OverconstrainedError") {
        message = "No camera matching the requested constraints was found."
      } else if (error.name === "TypeError" || error.message === "Camera API is not supported in this browser") {
        message = "Your browser doesn't support camera access."
      }

      setErrorMessage(message)
      setPermissionError(true)
      setIsLoading(false)

      toast({
        title: "Camera Error",
        description: message,
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
      setStream(null)
    }

    // Clear video source
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null
    }

    setCameraActive(false)
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
              <h3 className="text-lg font-medium">Camera Access Error</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                {errorMessage ||
                  "We couldn't access your camera. This could be due to browser permissions or your device settings."}
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="default" onClick={startCamera}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Accessing camera...</p>
            </div>
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
                Position yourself in the frame to see how the item looks on you.
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
  )
}
