import FloatingParticles from './FloatingParticles';

const AnimatedBackground = () => {
  const images = [
    'undraw_booked_bb22.png',
    'undraw_date-picker_qe47.png', 
    'undraw_next-tasks_y3rm.png',
    'undraw_schedule_6t8k.png',
    'undraw_scrum-board_uqku.png'
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900"></div>
      
      {/* Animated images - Row 1 */}
      <div className="absolute top-10 left-0 w-full">
        <div className="flex animate-scroll-right space-x-32 opacity-10">
          {images.map((image, index) => (
            <img 
              key={`row1-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-16 h-16 animate-float"
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
          {/* Duplicate for seamless loop */}
          {images.map((image, index) => (
            <img 
              key={`row1-dup-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-16 h-16 animate-float"
              style={{ animationDelay: `${(index + 5) * 0.5}s` }}
            />
          ))}
        </div>
      </div>

      {/* Animated images - Row 2 (reverse direction) */}
      <div className="absolute top-40 left-0 w-full">
        <div className="flex animate-scroll-left space-x-40 opacity-8">
          {images.map((image, index) => (
            <img 
              key={`row2-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-12 h-12 animate-pulse"
              style={{ animationDelay: `${index * 0.8}s` }}
            />
          ))}
          {/* Duplicate for seamless loop */}
          {images.map((image, index) => (
            <img 
              key={`row2-dup-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-12 h-12 animate-pulse"
              style={{ animationDelay: `${(index + 5) * 0.8}s` }}
            />
          ))}
        </div>
      </div>

      {/* Animated images - Row 3 */}
      <div className="absolute top-72 left-0 w-full">
        <div className="flex animate-scroll-right-slow space-x-48 opacity-6">
          {images.map((image, index) => (
            <img 
              key={`row3-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-20 h-20 animate-bounce"
              style={{ animationDelay: `${index * 1.2}s`, animationDuration: '3s' }}
            />
          ))}
          {/* Duplicate for seamless loop */}
          {images.map((image, index) => (
            <img 
              key={`row3-dup-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-20 h-20 animate-bounce"
              style={{ animationDelay: `${(index + 5) * 1.2}s`, animationDuration: '3s' }}
            />
          ))}
        </div>
      </div>

      {/* Animated images - Row 4 (reverse direction) */}
      <div className="absolute bottom-40 left-0 w-full">
        <div className="flex animate-scroll-left-slow space-x-36 opacity-8">
          {images.map((image, index) => (
            <img 
              key={`row4-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-14 h-14 animate-spin-slow"
              style={{ animationDelay: `${index * 0.6}s` }}
            />
          ))}
          {/* Duplicate for seamless loop */}
          {images.map((image, index) => (
            <img 
              key={`row4-dup-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-14 h-14 animate-spin-slow"
              style={{ animationDelay: `${(index + 5) * 0.6}s` }}
            />
          ))}
        </div>
      </div>

      {/* Animated images - Row 5 */}
      <div className="absolute bottom-10 left-0 w-full">
        <div className="flex animate-scroll-right space-x-44 opacity-10">
          {images.map((image, index) => (
            <img 
              key={`row5-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-16 h-16 animate-float"
              style={{ animationDelay: `${index * 0.7}s` }}
            />
          ))}
          {/* Duplicate for seamless loop */}
          {images.map((image, index) => (
            <img 
              key={`row5-dup-${index}`} 
              src={`/img/${image}`} 
              alt="task-icon"
              className="flex-shrink-0 w-16 h-16 animate-float"
              style={{ animationDelay: `${(index + 5) * 0.7}s` }}
            />
          ))}
        </div>
      </div>

      {/* Blue overlay for better contrast */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
      
      {/* Floating particles */}
      <FloatingParticles />
    </div>
  );
};

export default AnimatedBackground;
