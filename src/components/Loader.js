import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const WLFICustomLoader = () => {
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

    // Initialize particles for WLFI neural effect
    particlesRef.current = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: ['#e7ac08', '#fdd949', '#4ade80', '#f87171', '#8b5cf6'][i % 5],
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
      
      // Draw WLFI neural network background particles
      particlesRef.current.forEach(particle => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary bounce
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle with golden glow
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
      
      // Draw the WLFI logo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Create WLFI quantum shine effect with golden layers
      const gradient1 = ctx.createLinearGradient(
        shinePosition - shineWidth/2, 0, 
        shinePosition + shineWidth/2, 0
      );
      
      gradient1.addColorStop(0, 'rgba(231, 172, 8, 0)');
      gradient1.addColorStop(0.2, 'rgba(231, 172, 8, 0.3)');
      gradient1.addColorStop(0.4, 'rgba(253, 217, 73, 0.6)');
      gradient1.addColorStop(0.6, 'rgba(231, 172, 8, 0.6)');
      gradient1.addColorStop(0.8, 'rgba(253, 217, 73, 0.3)');
      gradient1.addColorStop(1, 'rgba(231, 172, 8, 0)');
      
      // Apply WLFI golden shine
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = gradient1;
      ctx.fillRect(shinePosition - shineWidth/2, 0, shineWidth, canvas.height);
      
      // Add secondary golden shine layer
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
    <div className='min-h-screen max-w-md w-full relative flex flex-col items-center justify-center mx-auto overflow-hidden bg-[#171412]'>
      {/* WLFI Neural Network Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#171412] via-[#1c1917] to-[#171412]" />
        
        {/* Floating WLFI Neural Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: ['#e7ac08', '#fdd949', '#4ade80', '#f87171', '#8b5cf6'][i % 5],
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
        
        {/* WLFI Neural Grid Lines */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #e7ac08 1px, transparent 1px),
              linear-gradient(180deg, #e7ac08 1px, transparent 1px)
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

      {/* Main WLFI Logo with Quantum Shine Effect */}
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
            alt='World Liberty AI Logo' 
            width={300} 
            height={80}
            quality={100}
            className="opacity-0 absolute"
            crossOrigin="anonymous"
          />
          
          {/* Canvas for WLFI quantum shine effect */}
          <canvas 
            ref={canvasRef}
            className="relative z-10 rounded-xl"
            style={{ 
              width: '300px', 
              height: '80px',
              filter: 'drop-shadow(0 0 20px rgba(231, 172, 8, 0.3))'
            }}
          />
        </motion.div>
      </div>

      {/* WLFI Neural Status Indicators */}
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
              background: ['#e7ac08', '#fdd949', '#4ade80', '#f87171', '#8b5cf6'][i],
              boxShadow: `0 0 10px ${['#e7ac08', '#fdd949', '#4ade80', '#f87171', '#8b5cf6'][i]}`,
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

      {/* WLFI Neural Status Text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.h2
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e7ac08] to-[#fdd949] mb-2"
          animate={{
            textShadow: [
              '0 0 10px rgba(231, 172, 8, 0.8)',
              '0 0 20px rgba(253, 217, 73, 1)',
              '0 0 10px rgba(231, 172, 8, 0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Initializing World Liberty AI
        </motion.h2>
        
        <motion.p
          className="text-sm text-[#aaa29d]"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Neural networks synchronizing...
        </motion.p>
      </motion.div>

      {/* WLFI Loading Progress Bar */}
      <motion.div
        className="w-64 h-1 bg-[#44403c]/30 rounded-full mt-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#e7ac08] via-[#fdd949] to-[#e7ac08]"
          animate={{
            x: ['-100%', '100%'],
            background: [
              'linear-gradient(90deg, #e7ac08, #fdd949, #e7ac08)',
              'linear-gradient(90deg, #fdd949, #e7ac08, #fdd949)',
              'linear-gradient(90deg, #e7ac08, #fdd949, #4ade80)',
              'linear-gradient(90deg, #fdd949, #4ade80, #e7ac08)',
              'linear-gradient(90deg, #4ade80, #e7ac08, #fdd949)',
            ]
          }}
          transition={{
            x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            background: { duration: 10, repeat: Infinity }
          }}
        />
      </motion.div>

      {/* WLFI Brand Footer */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div
            className="w-2 h-2 bg-[#4ade80] rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-[#aaa29d] font-medium">
            Revolutionary AI-powered Financial Intelligence
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default WLFICustomLoader;
