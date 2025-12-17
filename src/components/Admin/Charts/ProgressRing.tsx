// export function ProgressRing({
//     radius = 50,
//     strokeWidth = 6,
//     stroke = "#23c423",
//     progress = 0,
//     bg = "#EFF0F6",
//     labelStyle = {},
//   }) {
//     const normalizedRadius = radius - strokeWidth * 2;
//     const circumference = normalizedRadius * 2 * Math.PI;
  
//     const strokeDashoffset = circumference - (progress / 100) * circumference;
  
//     return (
//       <div
//         style={{
//           width: radius * 2,
//           height: radius * 2,
//         }}
//       >
//         <svg height={radius * 2} width={radius * 2}>
//           <circle
//             r={normalizedRadius}
//             stroke={bg}
//             fill="transparent"
//             strokeWidth={strokeWidth}
//             cx={radius}
//             cy={radius}
//           />
//           <circle
//             // stroke='#23c423'
//             stroke={stroke}
//             fill="transparent"
//             strokeWidth={strokeWidth}
//             strokeDasharray={circumference + " " + circumference}
//             style={{ strokeDashoffset }}
//             r={normalizedRadius}
//             cx={radius}
//             cy={radius}
//           />
//           <text
//             style={labelStyle}
//             x="50%"
//             y="50%"
//             dominantBaseline="middle"
//             textAnchor="middle"
//           >
//             {progress}%
//           </text>
//         </svg>
//       </div>
//     );
//   }
  


import React from "react";

type DoughnutChartProps = {
  data: { value: number; color: string }[];
  total: number;
  radius?: number;
  strokeWidth?: number;
};

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  total,
  radius = 50,
  strokeWidth = 20,
}) => {
  const circumference = 2 * Math.PI * radius;

  // Accumulated offset
  let cumulative = 0;
  
  const hasData = data.length > 0 && total > 0;

  return (
    <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
      <g transform={`translate(${radius + strokeWidth / 2},${radius + strokeWidth / 2})`}>

       {!hasData && (
          <circle
            r={radius}
            fill="transparent"
            stroke="#E5E7EB" // light gray
            strokeWidth={strokeWidth}
            transform="rotate(-90)"
          />
        )}



        {hasData&&data.map((d, i) => {
          const valuePercent = d.value / total;
          const dash = valuePercent * circumference;
          const gap = circumference - dash;

          const circle = (
            <circle
              key={i}
              r={radius}
              fill="transparent"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-cumulative}
              strokeLinecap="butt"
              transform="rotate(-90)"
            />
          );

          cumulative += dash;
          return circle;
        })}

        {/* Center Text */}
        <text
          textAnchor="middle"
          // dy="-0.2em"
          dominantBaseline="middle"
          fontSize="14"
          y={-10}
          fill="#555"
        >
          Total
        </text>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          // dy="1.2em"
          y={15}
          fontSize="28"
          fontWeight="bold"
          fill="#000"
        >
          {total}
        </text>
      </g>
    </svg>
  );
};











