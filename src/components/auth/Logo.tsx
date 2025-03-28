
import { ProgressiveImage } from '@/components/common/ProgressiveImage';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 animate-scale-in hover:scale-105 transition-all duration-300 ease-in-out">
      <ProgressiveImage 
        src="https://framerusercontent.com/images/9N8Z1vTRbJsHlrIuTjm6Ajga4dI.png" 
        alt="Pullse Logo" 
        className="h-8 w-auto animate-pulse hover:animate-none cursor-pointer"
        priority={true}
        width={32}
        height={32}
      />
    </div>
  );
};
