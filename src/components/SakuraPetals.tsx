import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SakuraPetals = () => {
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 20,
      size: 10 + Math.random() * 15,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ top: -20, opacity: 0, rotate: 0 }}
          animate={{
            top: '110%',
            opacity: [0, 1, 1, 0],
            rotate: 360,
            x: [0, 50, -50, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            left: petal.left,
            width: petal.size,
            height: petal.size,
            background: 'rgba(255, 183, 197, 0.6)',
            borderRadius: '100% 0% 100% 0%',
            boxShadow: '0 0 10px rgba(255, 183, 197, 0.4)',
          }}
        />
      ))}
    </div>
  );
};

export default SakuraPetals;
