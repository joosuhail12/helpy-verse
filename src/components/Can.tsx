
import { useAppSelector } from "@/hooks/useAppSelector";
import { createContext, createElement, useContext, useEffect, useState } from "react";
import { AppAbility, defineAppAbility } from "@/utils/ability";
import { RootState } from "@/store/store";

// Create our own AbilityContext since @casl/react doesn't export it directly in the version we're using
export const AbilityContext = createContext<AppAbility | undefined>(undefined);

export const Can = (props: any) => {
  const auth = useAppSelector((state: RootState) => state.auth);
  const permissions = auth?.permissions || [];
  const [ability, setAbility] = useState<AppAbility>(defineAppAbility());

  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const newAbility = defineAppAbility();
      // Type-casting to any to avoid TypeScript errors
      // The actual implementation of CASL will validate the rules
      newAbility.update(permissions as any);
      setAbility(newAbility);
    }
  }, [permissions]);

  return createElement(AbilityContext.Provider, { value: ability }, props.do(ability));
};

// Hook to use ability context in components
export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (context === undefined) {
    throw new Error('useAbility must be used within a Can provider');
  }
  return context;
};
