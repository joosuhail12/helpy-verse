
import { useAppSelector } from "@/hooks/useAppSelector";
<<<<<<< HEAD
import { createContext, createElement, useContext, useEffect, useState } from "react";
import { AppAbility, defineAppAbility } from "@/utils/ability";

// Create our own AbilityContext since @casl/react doesn't export it directly in the version we're using
export const AbilityContext = createContext<AppAbility | undefined>(undefined);
=======
import { createElement } from "react";
import { AbilityContext } from "@casl/react";
import { useEffect, useState } from "react";
import { defineAppAbility, AppAbility } from "@/utils/ability";
>>>>>>> c756439 (Update frontend code)

export const Can = (props: any) => {
  const auth = useAppSelector((state) => state.auth);
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

<<<<<<< HEAD
  return createElement(AbilityContext.Provider, { value: ability }, props.do(ability));
};

// Hook to use ability context in components
export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (context === undefined) {
    throw new Error('useAbility must be used within a Can provider');
  }
  return context;
=======
  return createElement(AbilityContext.Provider, { value: ability }, 
    createElement(AbilityContext.Consumer, null, (context) => 
      props.do(context)
    )
  );
>>>>>>> c756439 (Update frontend code)
};
