import React from 'react';

export function GithubGraph() {
  // Generate fake contribution data (371 squares = 53 weeks * 7 days)
  const generateData = () => {
    return Array.from({ length: 371 }).map(() => {
      const rand = Math.random();
      if (rand > 0.85) return 4; // High
      if (rand > 0.6) return 3; // Medium-high
      if (rand > 0.4) return 2; // Medium-low
      if (rand > 0.2) return 1; // Low
      return 0; // None
    });
  };

  const data = generateData();
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  const getColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-zinc-300 dark:bg-zinc-200';
      case 3: return 'bg-zinc-400 dark:bg-zinc-400';
      case 2: return 'bg-zinc-500 dark:bg-zinc-600';
      case 1: return 'bg-zinc-600 dark:bg-zinc-700';
      default: return 'bg-zinc-100 dark:bg-[#1a1a1a]';
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-6">
      <div className="flex justify-between items-end mb-1 w-full">
        <div className="flex justify-between w-full text-zinc-500 pr-4">
          {months.map((m, i) => (
            <span key={i} className="text-[10px] sm:text-[11px]">{m}</span>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-[repeat(53,1fr)] gap-x-[2px] w-full">
        {Array.from({ length: 53 }).map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-[2px]">
            {Array.from({ length: 7 }).map((_, rowIndex) => {
              const index = colIndex * 7 + rowIndex;
              return (
                <div 
                  key={rowIndex} 
                  className={`w-full aspect-square rounded-[1px] sm:rounded-[2px] ${getColor(data[index])}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-1 px-1">
        <span className="text-[11px] text-zinc-500">1436 activities in 2025</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-500 mr-1">Less</span>
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-100 dark:bg-[#1a1a1a]" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-600 dark:bg-zinc-700" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-500 dark:bg-zinc-600" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-400 dark:bg-zinc-400" />
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-300 dark:bg-zinc-200" />
          <span className="text-[11px] text-zinc-500 ml-1">More</span>
        </div>
      </div>
    </div>
  );
}
