"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Users, ShoppingBag, Clock } from "lucide-react"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="about" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About WearView</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionizing the way you shop for clothes online with our cutting-edge virtual try-on technology.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="bg-background rounded-lg p-8 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">For Customers</h3>
            <p className="text-muted-foreground">
              Say goodbye to returns and size uncertainty. WearView lets you see exactly how clothes will look on your
              body before you buy, giving you confidence in every purchase.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-background rounded-lg p-8 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">For Companies</h3>
            <p className="text-muted-foreground">
              Reduce return rates by up to 40% and increase conversion rates. Our technology helps retailers provide a
              superior shopping experience while improving their bottom line.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-background rounded-lg p-8 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Save Time</h3>
            <p className="text-muted-foreground">
              No more wasted time in fitting rooms or dealing with returns. Shop efficiently from anywhere, anytime, and
              see exactly how clothes will fit your unique body shape.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 bg-background rounded-lg p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Improving the Shopping Experience</h3>
              <p className="text-muted-foreground mb-6">
                WearView bridges the gap between online and in-store shopping experiences. Our platform uses advanced
                body measurement technology and 3D modeling to create a virtual fitting room that's accessible from
                anywhere.
              </p>
              <p className="text-muted-foreground">
                By providing accurate visual representations of how clothes will look and fit on your body, we're
                eliminating the guesswork from online shopping and making it more enjoyable, efficient, and sustainable.
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">40%</div>
                <p className="text-sm text-muted-foreground">Reduction in returns</p>
                <div className="my-4 border-t border-border"></div>
                <div className="text-4xl font-bold text-primary mb-2">25%</div>
                <p className="text-sm text-muted-foreground">Increase in conversion</p>
                <div className="my-4 border-t border-border"></div>
                <div className="text-4xl font-bold text-primary mb-2">15min</div>
                <p className="text-sm text-muted-foreground">Average time saved per purchase</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
