import { useCallback, useEffect, useRef } from "react";
import { Color, colorString, isDark } from "../utils/color";

export type GraphProps = {
  title: string;
  background: Color;
  width: number;
  height: number;
  data: [string, Color, number][];
  fontSize: number;
  font: string;
  titleSize: number;
};

export default function PollGraph(props: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height, title, data, background } = props;

      const fontSize = width/500 * props.fontSize
      const titleSize = width/500 * props.titleSize

      const total = data.map<number>((data) => data[2]).reduce((last, curr) => last + curr, 0);

      ctx.fillStyle = colorString(background);
      ctx.fillRect(0, 0, width, height);

      const centerY = height/2
      const centerX = width/2
      const radius = Math.min(width, height)/4
     
      ctx.fillStyle = "white"
      ctx.textBaseline = "middle"
      ctx.textAlign = "center"
      ctx.font = `${titleSize}px ${props.font}`
      ctx.fillText(title, centerX, centerY/4)
      
      ctx.font = `${fontSize}px ${props.font}`
    
      let last = 0;

      for (let i = 0; i < props.data.length; i++) {
        const [text, color, votes] = props.data[i];

        ctx.fillStyle = colorString(color);

        const fullness = votes / total;
        const angle = fullness * Math.PI * 2;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius, 0, last, last + angle);
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(last) * radius, centerY + Math.sin(last) * radius)
        ctx.lineTo(centerX + Math.cos(last+angle) * radius, centerY + Math.sin(last+angle) * radius)
        ctx.moveTo(centerX, centerY)
        ctx.fill();

        const textPositioning = (radius*3/4) * (1-fullness) + radius*1/4 * (fullness)
 
        ctx.save()
        const halfAngle = last + angle * 0.5
        ctx.translate(width/2, height/2)
        ctx.translate(Math.cos(halfAngle) * textPositioning, Math.sin(halfAngle) * textPositioning) 
       
        if (isDark(color)) {
          ctx.fillStyle="white"
        } else {
          ctx.fillStyle="black"
        }
        
        ctx.fillText(text, 0, 0)
        ctx.restore()
        last += angle;
      }
    },
    [props]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    render(ctx);
  }, [render]);

  return <canvas ref={canvasRef} width={props.width} height={props.height}></canvas>;
}
