import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoostAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  appName?: string;
}

const BoostAnimation = ({ isVisible, onComplete, appName = "Game" }: BoostAnimationProps) => {
  const [phase, setPhase] = useState<'charging' | 'boosted' | 'complete'>('charging');

  useEffect(() => {
    if (isVisible) {
      setPhase('charging');
      
      // Charging phase
      const timer1 = setTimeout(() => {
        setPhase('boosted');
      }, 1500);
      
      // Complete phase
      const timer2 = setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && phase !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center overflow-hidden"
        >
          {/* Background particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500 rounded-full"
                initial={{
                  x: '50vw',
                  y: '50vh',
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Energy Cube Container */}
          <div className="relative">
            {/* Outer glow rings */}
            <motion.div
              className="absolute inset-0 -m-20"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 border-red-500/30 rounded-full"
                  style={{
                    margin: `${i * 20}px`
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </motion.div>

            {/* Energy Cube */}
            <motion.div
              className="relative w-32 h-32"
              animate={{
                rotateY: 360,
                rotateX: 360
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: 1000
              }}
            >
              {/* Cube faces */}
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face, i) => {
                const transforms: Record<string, string> = {
                  front: 'translateZ(64px)',
                  back: 'translateZ(-64px) rotateY(180deg)',
                  left: 'translateX(-64px) rotateY(-90deg)',
                  right: 'translateX(64px) rotateY(90deg)',
                  top: 'translateY(-64px) rotateX(90deg)',
                  bottom: 'translateY(64px) rotateX(-90deg)'
                };
                
                return (
                  <motion.div
                    key={face}
                    className="absolute w-32 h-32 border-2 border-red-500 bg-gradient-to-br from-red-500/20 to-red-900/40"
                    style={{
                      transform: transforms[face],
                      backfaceVisibility: 'visible'
                    }}
                    animate={{
                      borderColor: phase === 'boosted' 
                        ? ['#ef4444', '#fbbf24', '#ef4444'] 
                        : '#ef4444',
                      boxShadow: phase === 'boosted'
                        ? ['0 0 20px #ef4444', '0 0 40px #fbbf24', '0 0 20px #ef4444']
                        : '0 0 20px #ef4444'
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: phase === 'boosted' ? Infinity : 0
                    }}
                  >
                    {/* Inner energy pattern */}
                    <div className="absolute inset-2 border border-red-400/50">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-red-500/50 to-transparent"
                        animate={{
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}

              {/* Core energy ball */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full bg-gradient-radial from-white via-red-400 to-red-600"
                style={{
                  boxShadow: '0 0 60px #ef4444, 0 0 100px #ef4444',
                  background: 'radial-gradient(circle, #fff 0%, #f87171 30%, #dc2626 70%, #991b1b 100%)'
                }}
                animate={{
                  scale: phase === 'boosted' ? [1, 1.5, 1] : [1, 1.2, 1]
                }}
                transition={{
                  duration: phase === 'boosted' ? 0.3 : 0.8,
                  repeat: Infinity
                }}
              />
            </motion.div>

            {/* Energy beams */}
            {phase === 'boosted' && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-transparent origin-left"
                    style={{
                      width: '150px',
                      transform: `rotate(${i * 45}deg)`,
                      marginLeft: '-16px',
                      marginTop: '-2px'
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ 
                      scaleX: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.05,
                      repeat: Infinity
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Text */}
          <motion.div
            className="absolute bottom-1/4 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p
              className="text-2xl font-bold text-white mb-2"
              animate={{
                textShadow: phase === 'boosted' 
                  ? ['0 0 10px #ef4444', '0 0 30px #fbbf24', '0 0 10px #ef4444']
                  : '0 0 10px #ef4444'
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {phase === 'charging' ? 'CHARGING...' : 'BOOSTED!'}
            </motion.p>
            <p className="text-sm text-red-400">{appName}</p>
            
            {/* Progress bar */}
            <div className="mt-4 mx-auto w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-red-500"
                initial={{ width: '0%' }}
                animate={{ 
                  width: phase === 'boosted' ? '100%' : '70%'
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BoostAnimation;
