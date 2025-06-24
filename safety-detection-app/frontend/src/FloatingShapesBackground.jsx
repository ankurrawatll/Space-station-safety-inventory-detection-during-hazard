import React from "react";
import { motion } from "framer-motion";

// 7 circles, different sizes, all dark blue, glowing, floating like bubbles
const SHAPE_COLOR = "#1B1A55";
const SHAPE_OPACITY = 0.18;

// Each circle: unique size, position, speed, and float direction
const circles = [
  { size: 260, top: "8%", left: "12%", duration: 8, x: 40, y: -60, delay: 0 },
  { size: 200, top: "55%", left: "65%", duration: 10, x: -30, y: -50, delay: 1.2 },
  { size: 220, top: "25%", left: "55%", duration: 9, x: 50, y: -40, delay: 0.7 },
  { size: 160, top: "70%", left: "22%", duration: 7, x: -40, y: -70, delay: 2.1 },
  { size: 180, top: "38%", left: "80%", duration: 8.5, x: 30, y: -60, delay: 1.7 },
  { size: 140, top: "82%", left: "48%", duration: 9.5, x: 60, y: -30, delay: 1.1 },
  { size: 300, top: "15%", left: "35%", duration: 11, x: -50, y: -80, delay: 0.5 },
];

const FloatingShapesBackground = () => (
  <div
    className="pointer-events-none absolute inset-0 w-full h-full z-0"
    aria-hidden="true"
    style={{ overflow: "hidden" }}
  >
    {circles.map((circle, i) => {
      const floatAnim = {
        y: [0, circle.y, 0],
        x: [0, circle.x, 0],
        transition: {
          duration: circle.duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: circle.delay,
        },
      };
      return (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: circle.top,
            left: circle.left,
            zIndex: 0,
            filter: `drop-shadow(0 0 32px #1B1A55) drop-shadow(0 0 64px #3C0753)`,
          }}
          animate={floatAnim}
        >
          <svg width={circle.size} height={circle.size}>
            <circle
              cx={circle.size / 2}
              cy={circle.size / 2}
              r={circle.size / 2}
              fill={SHAPE_COLOR}
              opacity={SHAPE_OPACITY}
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>
      );
    })}
  </div>
);

export default FloatingShapesBackground; 