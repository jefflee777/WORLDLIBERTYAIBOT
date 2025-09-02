import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const CustomLoader = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!canvas || !ctx || !img) return;

    // Set canvas size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Initialize particles for neural effect
    particlesRef.current = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: ['#00F0FF', '#36FF00', '#FFD500', '#FF4E00', '#FF007C'][i % 5],
      opacity: Math.random() * 0.8 + 0.2
    }));

    let shinePosition = -80;
    const shineWidth = 60;
    const totalWidth = canvas.width + shineWidth + 80;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw neural network background particles
      particlesRef.current.forEach(particle => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary bounce
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = particle.opacity * (0.5 + 0.5 * Math.sin(time * 3 + particle.x));
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      // Draw the original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Create quantum shine effect with multiple layers
      const gradient1 = ctx.createLinearGradient(
        shinePosition - shineWidth/2, 0, 
        shinePosition + shineWidth/2, 0
      );
      
      gradient1.addColorStop(0, 'rgba(0, 240, 255, 0)');
      gradient1.addColorStop(0.2, 'rgba(0, 240, 255, 0.3)');
      gradient1.addColorStop(0.4, 'rgba(54, 255, 0, 0.6)');
      gradient1.addColorStop(0.6, 'rgba(255, 213, 0, 0.6)');
      gradient1.addColorStop(0.8, 'rgba(255, 78, 0, 0.3)');
      gradient1.addColorStop(1, 'rgba(255, 0, 124, 0)');
      
      // Apply quantum shine with composite operation
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = gradient1;
      ctx.fillRect(shinePosition - shineWidth/2, 0, shineWidth, canvas.height);
      
      // Add secondary shine layer
      const gradient2 = ctx.createLinearGradient(
        shinePosition - shineWidth/4, 0, 
        shinePosition + shineWidth/4, 0
      );
      
      gradient2.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient2.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(shinePosition - shineWidth/4, 0, shineWidth/2, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      
      // Update shine position
      shinePosition += 3;
      if (shinePosition > totalWidth) {
        shinePosition = -80;
        // Add delay before next quantum scan
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate);
        }, 1500);
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation when image loads
    const handleImageLoad = () => {
      animate();
    };

    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener('load', handleImageLoad);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      img.removeEventListener('load', handleImageLoad);
    };
  }, []);

  return (
    <div className='min-h-screen max-w-md w-full relative flex flex-col items-center justify-center mx-auto overflow-hidden bg-[#0B0B0C]'>
      {/* Neural Network Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0C] via-[#141414] to-[#1A1A1C]" />
        
        {/* Floating Neural Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: ['#00F0FF', '#36FF00', '#FFD500', '#FF4E00', '#FF007C'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Neural Grid Lines */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #00F0FF 1px, transparent 1px),
              linear-gradient(180deg, #00F0FF 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Main Logo with Quantum Shine Effect */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Hidden image for canvas reference */}
          <Image 
            ref={imageRef}
            src='/logo.png' 
            alt='TRADON Logo' 
            width={300} 
            height={80}
            quality={100}
            className="opacity-0 absolute"
            crossOrigin="anonymous"
          />
          
          {/* Canvas for quantum shine effect */}
          <canvas 
            ref={canvasRef}
            className="relative z-10 rounded-xl"
            style={{ 
              width: '300px', 
              height: '80px',
              filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.3))'
            }}
          />
        </motion.div>
      </div>

      {/* Neural Status Indicators */}
      <motion.div
        className="flex items-center space-x-4 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              background: ['#00F0FF', '#36FF00', '#FFD500', '#FF4E00', '#FF007C'][i],
              boxShadow: `0 0 10px ${['#00F0FF', '#36FF00', '#FFD500', '#FF4E00', '#FF007C'][i]}`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Neural Status Text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.h2
          className="text-xl font-bold text-[#00F0FF] mb-2"
          animate={{
            textShadow: [
              '0 0 10px rgba(0, 240, 255, 0.8)',
              '0 0 20px rgba(0, 240, 255, 1)',
              '0 0 10px rgba(0, 240, 255, 0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Initializing TRADON
        </motion.h2>
        
        <motion.p
          className="text-sm text-[#E6E6E6]/70"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Neural networks synchronizing...
        </motion.p>
      </motion.div>

      {/* Loading Progress Bar */}
      <motion.div
        className="w-64 h-1 bg-[#E6E6E6]/10 rounded-full mt-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] via-[#36FF00] to-[#FFD500]"
          animate={{
            x: ['-100%', '100%'],
            background: [
              'linear-gradient(90deg, #00F0FF, #36FF00, #FFD500)',
              'linear-gradient(90deg, #36FF00, #FFD500, #FF4E00)',
              'linear-gradient(90deg, #FFD500, #FF4E00, #FF007C)',
              'linear-gradient(90deg, #FF4E00, #FF007C, #00F0FF)',
              'linear-gradient(90deg, #FF007C, #00F0FF, #36FF00)',
            ]
          }}
          transition={{
            x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            background: { duration: 10, repeat: Infinity }
          }}
        />
      </motion.div>
    </div>
  );
};

export default CustomLoader;
