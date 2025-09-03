'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { 
    IoPersonAddOutline,   
    IoCheckmarkDoneOutline 
} from 'react-icons/io5'; 
import { FiHome } from "react-icons/fi";
import { MdAutoGraph } from "react-icons/md";

export default function BottomNav({ activeTab, setActiveTab }) {
    const [isVisible, setIsVisible] = useState(true);

    const navItems = [
        { 
            id: 'home', 
            icon: FiHome, 
            label: 'Neural Core',
            color: '#00F0FF'
        },
        { 
            id: 'dataCenter', 
            icon: MdAutoGraph,
            label: 'Data Stream',
            color: '#36FF00'
        },
        { 
            id: 'SPAI', 
            icon: '/agent/agentlogo.png',
            label: 'TRADON',
            isSpecial: true,
            color: '#FFD500'
        },
        { 
            id: 'invite', 
            icon: IoPersonAddOutline,
            label: 'Network',
            color: '#FF4E00'
        },
        { 
            id: 'task', 
            icon: IoCheckmarkDoneOutline,
            label: 'Missions',
            color: '#FF007C'
        },
    ];

    return (
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-3">
            <motion.div 
                className="glass border border-[#E6E6E6]/20 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden relative"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{padding:"4px"}}
            >
                {/* Neural Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 via-[#36FF00]/5 to-[#FF007C]/5 opacity-50" />

                <nav className={cn(
                    "relative flex items-center justify-between transition-all duration-300 transform px-1 py-0.5",
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                )}>
                    {navItems.map((item, index) => {
                        const isActive = activeTab === item.id;
                        
                        return (
                            <Link
                                key={item.id}
                                href={`/?tab=${item.id}`}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "relative flex flex-col items-center justify-center transition-all duration-300 rounded-2xl min-w-[60px] group",
                                    item.isSpecial ? "px-3 py-2" : "px-3 py-4"
                                )}
                            >
                                {/* Active Background Glow */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl opacity-20"
                                        style={{ backgroundColor: item.color }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.2 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                
                                {/* Neural Ring for Special Item */}
                                {item.isSpecial && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl border-2 border-[#FFD500]/30"
                                        animate={{
                                            borderColor: isActive 
                                                ? ["rgba(255, 213, 0, 0.3)", "rgba(255, 213, 0, 0.8)", "rgba(255, 213, 0, 0.3)"]
                                                : "rgba(255, 213, 0, 0.3)"
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}

                                {/* Icon Container */}
                                <motion.div 
                                    className={cn(
                                        "transition-all duration-300 flex items-center justify-center mb-1 relative",
                                        item.isSpecial ? "w-10 h-10" : "w-6 h-6"
                                    )}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        filter: isActive 
                                            ? `drop-shadow(0 0 8px ${item.color})` 
                                            : "drop-shadow(0 0 0px transparent)"
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {item.isSpecial ? (
                                        <div className="relative w-full h-full rounded-xl flex items-center justify-center">
                                            <Image 
                                                src={item.icon} 
                                                width={100} 
                                                height={100} 
                                                quality={80} 
                                                alt={item.label} 
                                                className="transition-all duration-300 scale-200"
                                            />
                                            {/* Pulse Effect for TRADON */}
                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0 bg-[#FFD500]/20 rounded-xl"
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.5, 0, 0.5]
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <item.icon 
                                                size={isActive ? 26 : 24}
                                                className="transition-all duration-300 relative z-10"
                                                style={{
                                                    color: isActive ? item.color : '#E6E6E6'
                                                }}
                                            />
                                        </>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </motion.div>
            
            {/* Enhanced Shadow Effect */}
            <div className="absolute inset-0 bg-[#0B0B0C]/60 rounded-3xl blur-xl opacity-40 -z-10 scale-110" />
        </div>
    );
}
