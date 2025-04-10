
import React, { useState, useEffect } from 'react';
import { MiniMap, useReactFlow, Panel } from '@xyflow/react';
import { 
  ZoomIn, 
  ZoomOut,
  Grid3x3,
  Maximize,
  MinusCircle,
  PlusCircle,
  Map,
  AlignJustify,
  AlignStartVertical,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface WorkspaceControlsProps {
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  onFitView: () => void;
  gridSize: string;
  setGridSize: (size: string) => void;
}

const nodeClassName = (node: any) => node.type;

export const WorkspaceControls: React.FC<WorkspaceControlsProps> = ({
  snapToGrid,
  setSnapToGrid,
  onFitView,
  gridSize,
  setGridSize
}) => {
  const reactFlowInstance = useReactFlow();
  const [minimapVisible, setMinimapVisible] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  
  // Update current zoom when the component mounts and whenever viewport changes
  useEffect(() => {
    if (reactFlowInstance) {
      setCurrentZoom(Math.round(reactFlowInstance.getViewport().zoom * 100) / 100);
    }
  }, [reactFlowInstance]);
  
  const handleZoomIn = () => {
    reactFlowInstance.zoomIn();
    // Update zoom level after zooming in
    setCurrentZoom(Math.round(reactFlowInstance.getViewport().zoom * 100) / 100);
  };
  
  const handleZoomOut = () => {
    reactFlowInstance.zoomOut();
    // Update zoom level after zooming out
    setCurrentZoom(Math.round(reactFlowInstance.getViewport().zoom * 100) / 100);
  };
  
  const handleZoomTo = (level: number) => {
    reactFlowInstance.setViewport({ x: 0, y: 0, zoom: level });
    // Update zoom level after setting specific zoom
    setCurrentZoom(level);
  };
  
  const handleToggleSnapToGrid = (pressed: boolean) => {
    setSnapToGrid(pressed);
  };

  const handleGridSizeChange = (value: string) => {
    setGridSize(value);
  };

  return (
    <>
      {/* Main controls panel - bottom left */}
      <Panel position="bottom-left" className="bg-background border rounded-lg shadow-sm p-2 m-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle 
                    aria-label="Toggle minimap" 
                    pressed={minimapVisible}
                    onPressedChange={setMinimapVisible}
                    size="sm"
                  >
                    <Map size={16} />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle minimap</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle 
                    aria-label="Toggle grid snapping"
                    pressed={snapToGrid}
                    onPressedChange={handleToggleSnapToGrid}
                    size="sm"
                    className={cn(
                      snapToGrid ? "bg-purple-100 text-purple-700 border-purple-300" : ""
                    )}
                  >
                    <LayoutGrid size={16} />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle grid snapping</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={onFitView}
                  >
                    <Maximize size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fit to view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Grid size selector - only visible when grid snapping is enabled */}
          {snapToGrid && (
            <div className="flex items-center mt-1">
              <span className="text-xs mr-2 text-muted-foreground">Grid:</span>
              <Select 
                value={gridSize} 
                onValueChange={handleGridSizeChange}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="Grid Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10px</SelectItem>
                  <SelectItem value="15">15px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                  <SelectItem value="25">25px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center gap-1 mt-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleZoomOut}
            >
              <MinusCircle size={14} />
            </Button>
            
            <div className="flex-1 mx-1">
              <Badge variant="outline" className="w-full flex justify-center">
                {Math.round(currentZoom * 100)}%
              </Badge>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleZoomIn}
            >
              <PlusCircle size={14} />
            </Button>
          </div>
          
          <div className="flex justify-between gap-1 mt-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-6 flex-1" 
              onClick={() => handleZoomTo(0.5)}
            >
              50%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-6 flex-1" 
              onClick={() => handleZoomTo(1)}
            >
              100%
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-6 flex-1" 
              onClick={() => handleZoomTo(1.5)}
            >
              150%
            </Button>
          </div>
        </div>
      </Panel>

      {/* Design controls panel - top right */}
      <Panel position="top-right" className="bg-background border rounded-lg shadow-sm p-2 m-4">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                  onClick={() => reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false })}
                >
                  <AlignJustify size={14} className="mr-1" />
                  <span className="text-xs">Auto Layout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Auto arrange nodes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                  onClick={onFitView}
                >
                  <AlignStartVertical size={14} className="mr-1" />
                  <span className="text-xs">Center View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Center the workflow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Panel>
      
      {/* Conditional minimap - bottom right */}
      {minimapVisible && (
        <Panel position="bottom-right" className="mr-4 mb-4">
          <div className="bg-background border rounded-md shadow-md overflow-hidden">
            <MiniMap 
              zoomable 
              pannable 
              nodeClassName={nodeClassName} 
              maskColor="rgba(240, 240, 240, 0.6)"
              style={{ 
                height: 120,
                width: 180
              }}
            />
          </div>
        </Panel>
      )}
    </>
  );
};
