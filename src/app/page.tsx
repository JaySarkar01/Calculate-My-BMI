"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const BMI_CATEGORIES = [
  { range: [0, 18.5], label: "Underweight", color: "bg-blue-400" },
  { range: [18.5, 25], label: "Normal", color: "bg-green-400" },
  { range: [25, 30], label: "Overweight", color: "bg-yellow-400" },
  { range: [30, Infinity], label: "Obese", color: "bg-red-400" },
];

export default function Home() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [ref, inView] = useInView({ threshold: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bmi !== null) {
      const animation = animate(count, bmi, { duration: 1.5, ease: "easeOut" });
      return animation.stop;
    }
  }, [bmi]);

  useEffect(() => {
    if (bmi !== null) {
      const foundCategory = BMI_CATEGORIES.find(
        ({ range }) => bmi >= range[0] && bmi < range[1]
      );
      setCategory(foundCategory?.label || null);
    }
  }, [bmi]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    const Sheight = parseFloat(height);
    const Sweight = parseFloat(weight);

    if (!isNaN(Sheight) && !isNaN(Sweight)) {
      setTimeout(() => {
        const heightInMeters = Sheight / 100;
        const calculatedBMI = Sweight / (heightInMeters * heightInMeters);
        setBmi(Math.round(calculatedBMI * 100) / 100);
        setIsCalculating(false);

        // 3D shake effect
        if (formRef.current) {
          formRef.current.style.transform = 'rotateY(10deg)';
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.style.transform = 'rotateY(-10deg)';
              setTimeout(() => {
                if (formRef.current) {
                  formRef.current.style.transform = 'rotateY(0deg)';
                }
              }, 150);
            }
          }, 150);
        }
      }, 800);
    } else {
      setBmi(null);
      setIsCalculating(false);
      
      // Error shake animation
      if (formRef.current) {
        const animation = formRef.current.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
          ],
          { duration: 300 }
        );
        animation.onfinish = () => {
          if (formRef.current) {
            formRef.current.style.transform = 'translateX(0)';
          }
        };
      }
    }
  };

  return (
    <div className={`${inter.className} min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50`}>
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-200 opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div 
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-200 opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          <motion.h1 
            className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            BMI Calculator
          </motion.h1>

          <form onSubmit={handleCalculate}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label htmlFor="weight" className="block mb-2 font-medium text-gray-700">Weight (kg)</label>
              <motion.input
                type="number"
                id="weight"
                className="mb-6 p-3 border-2 border-gray-200 rounded-xl w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="any"
                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <label htmlFor="height" className="block mb-2 font-medium text-gray-700">Height (cm)</label>
              <motion.input
                type="number"
                id="height"
                className="mb-6 p-3 border-2 border-gray-200 rounded-xl w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                step="any"
                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              disabled={isCalculating}
            >
              <span className="relative z-10">
                {isCalculating ? (
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Calculating...
                  </motion.span>
                ) : (
                  "Calculate BMI"
                )}
              </span>
              {isCalculating && (
                <motion.span
                  className="absolute top-0 left-0 h-full bg-white opacity-20"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "linear" }}
                />
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {bmi !== null && (
              <motion.div
                ref={ref}
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: "auto",
                  transition: { 
                    when: "beforeChildren",
                    staggerChildren: 0.1
                  } 
                }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 text-center space-y-4"
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-800"
                  initial={{ y: 20, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                >
                  Your BMI is:
                </motion.h2>
                
                <motion.div
                  className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                >
                  <motion.span>{rounded}</motion.span>
                </motion.div>
                
                {category && (
                  <motion.div
                    className={`mt-4 px-4 py-2 rounded-full inline-block ${BMI_CATEGORIES.find(c => c.label === category)?.color} text-white font-semibold`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={inView ? { 
                      scale: 1, 
                      opacity: 1,
                      transition: { delay: 0.3 }
                    } : {}}
                  >
                    {category}
                  </motion.div>
                )}
                
                <motion.div 
                  className="w-full bg-gray-200 rounded-full h-4 mt-6"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={inView ? { 
                    scaleX: 1, 
                    opacity: 1,
                    transition: { delay: 0.4 }
                  } : {}}
                >
                  <motion.div 
                    className="h-4 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={inView ? { 
                      scaleX: Math.min(bmi / 40, 1),
                      transition: { delay: 0.6, type: "spring" }
                    } : {}}
                    style={{
                      width: `${Math.min(bmi / 40 * 100, 100)}%`
                    }}
                  />
                </motion.div>
                
                <motion.div 
                  className="flex justify-between text-xs text-gray-500 mt-2"
                  initial={{ opacity: 0 }}
                  animate={inView ? { 
                    opacity: 1,
                    transition: { delay: 0.8 }
                  } : {}}
                >
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          className="text-center text-gray-500 mt-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Note: BMI is a screening tool but not a diagnostic of body fatness or health.
        </motion.div>
      </motion.div>
    </div>
  );
}