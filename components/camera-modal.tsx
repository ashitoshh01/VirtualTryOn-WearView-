import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Camera, CameraOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface TryOnModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const TryOnModal: React.FC<TryOnModalProps> = ({ open, onClose, product }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);

        toast({
          title: "Camera activated",
          description: "Position yourself and see how it looks on you!",
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraActive(false);

      toast({
        variant: "destructive",
        title: "Camera Access Error",
        description: "Unable to access your camera. Please check your browser permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="max-w-3xl w-full h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Try On: {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden bg-black rounded-md h-full">
          {/* Video stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Overlay product image */}
          {cameraActive && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-1/2 pointer-events-none opacity-80">
              <img
                src={product.image}
                alt={product.name}
                className="h-full object-contain"
              />
            </div>
          )}

          {/* Instruction Text */}
          {cameraActive && (
            <div className="absolute bottom-8 left-0 right-0 text-white text-center bg-black/50 p-4 animate-pulse">
              Adjust yourself to see how it fits!
            </div>
          )}

          {/* Error State */}
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <CameraOff size={48} />
              <p className="mt-4">Camera is not active</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={cameraActive ? "destructive" : "default"} onClick={cameraActive ? stopCamera : startCamera}>
            {cameraActive ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TryOnModal;
