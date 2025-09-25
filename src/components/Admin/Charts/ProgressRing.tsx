export function ProgressRing({
    radius = 50,
    strokeWidth = 6,
    stroke = "#23c423",
    progress = 0,
    bg = "#EFF0F6",
    labelStyle = {},
  }) {
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
  
    const strokeDashoffset = circumference - (progress / 100) * circumference;
  
    return (
      <div
        style={{
          width: radius * 2,
          height: radius * 2,
        }}
      >
        <svg height={radius * 2} width={radius * 2}>
          <circle
            r={normalizedRadius}
            stroke={bg}
            fill="transparent"
            strokeWidth={strokeWidth}
            cx={radius}
            cy={radius}
          />
          <circle
            // stroke='#23c423'
            stroke={stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <text
            style={labelStyle}
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {progress}%
          </text>
        </svg>
      </div>
    );
  }
  