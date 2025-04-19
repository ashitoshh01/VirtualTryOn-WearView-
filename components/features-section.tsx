"use client"

import { motion } from "framer-motion"
import { Smartphone, Ruler, Camera, RefreshCw, Layers, ShoppingCart } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Real-Time Try-On",
      description: "See clothes on your body in real-time with our advanced AR technology.",
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "Body Measurement Model",
      description: "Create your digital twin with accurate body measurements for perfect fitting.",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "QR Code Scanning",
      description: "Scan in-store items to try them on virtually and save for later.",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Mix & Match",
      description: "Combine different items to create and visualize complete outfits.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multi-Angle View",
      description: "Rotate and view clothes from all angles for a complete perspective.",
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Seamless Shopping",
      description: "Purchase items directly after trying them on with integrated checkout.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the innovative features that make WearView the leading virtual try-on platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-background rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6">
            Powered by AI & AR Technology
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 max-w-2xl mx-auto">
            Our technology adapts to your unique body shape for the most accurate virtual try-on experience
          </h3>
          <div className="max-w-4xl mx-auto bg-muted rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <p className="text-sm text-muted-foreground">Accuracy in body measurements</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-sm text-muted-foreground">Supported clothing brands</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5M+</div>
              <p className="text-sm text-muted-foreground">Virtual try-ons per month</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
