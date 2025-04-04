
/**
 * Debug utilities for tracking component renders
 */

// Track how many times a component renders
export const useRenderTracker = (componentName: string) => {
  const renderCountRef = React.useRef(0);
  
  React.useEffect(() => {
    renderCountRef.current += 1;
    console.log(`[Render Tracker] ${componentName} rendered ${renderCountRef.current} times`);
  });
};

// Wrap this around component props to see if they changed
export const trackPropChanges = (componentName: string, props: any) => {
  const prevProps = React.useRef(props);
  
  React.useEffect(() => {
    const changedProps: Record<string, { old: any; new: any }> = {};
    
    Object.entries(props).forEach(([key, value]) => {
      if (prevProps.current[key] !== value) {
        changedProps[key] = {
          old: prevProps.current[key],
          new: value,
        };
      }
    });
    
    if (Object.keys(changedProps).length > 0) {
      console.log(`[Prop Changes] ${componentName}:`, changedProps);
    }
    
    prevProps.current = props;
  });
};

// Add this if you need to see React's render schedules
export const enableReactDevTools = () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      // @ts-ignore - for debugging only
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
      console.log("React DevTools debug enabled");
    } catch (e) {
      console.warn("Could not enable React render debugging");
    }
  }
};
