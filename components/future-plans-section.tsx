"use client"

import { motion } from "framer-motion"
import { Smartphone, Globe, Headset, ShoppingBag, Zap, Store } from "lucide-react"

export default function FuturePlansSection() {
  const timelineItems = [
    {
      year: "2024",
      quarter: "Q3",
      title: "AR Integration",
      description: "Enhanced augmented reality features for more immersive try-on experiences.",
      icon: <Zap className="w-5 h-5 text-white" />,
      color: "from-purple-500 to-blue-500",
    },
    {
      year: "2024",
      quarter: "Q4",
      title: "Mobile App Launch",
      description: "Dedicated iOS and Android apps with offline capabilities.",
      icon: <Smartphone className="w-5 h-5 text-white" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      year: "2025",
      quarter: "Q1",
      title: "Global Retailer Partnerships",
      description: "Expanding our network with major fashion retailers worldwide.",
      icon: <Globe className="w-5 h-5 text-white" />,
      color: "from-cyan-500 to-green-500",
    },
    {
      year: "2025",
      quarter: "Q2",
      title: "VR Shopping Experience",
      description: "Virtual reality shopping environments for next-level immersion.",
      icon: <Headset className="w-5 h-5 text-white" />,
      color: "from-green-500 to-yellow-500",
    },
    {
      year: "2025",
      quarter: "Q3",
      title: "AI Style Recommendations",
      description: "Personalized outfit suggestions based on your preferences and body type.",
      icon: <ShoppingBag className="w-5 h-5 text-white" />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      year: "2025",
      quarter: "Q4",
      title: "In-Store Integration",
      description: "Bringing virtual try-on technology to physical retail locations.",
      icon: <Store className="w-5 h-5 text-white" />,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section id="future-plans" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Future Roadmap</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our vision for the future of WearView and virtual shopping experiences.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-red-500 rounded-full"></div>

            {/* Timeline items */}
            <div className="space-y-20">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      {item.year} • {item.quarter}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>

                  {/* Center point */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r border-4 border-background flex items-center justify-center z-10"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${item.color.split(" ")[1]}, ${item.color.split(" ")[3]})`,
                    }}
                  >
                    <div>{item.icon}</div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Join Us on Our Journey</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We're constantly innovating and pushing the boundaries of what's possible in virtual fashion technology.
            Stay updated with our progress and be the first to experience new features.
          </p>
          <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full">
            Subscribe to our newsletter for updates
          </div>
        </motion.div>
      </div>
    </section>
  )
}
