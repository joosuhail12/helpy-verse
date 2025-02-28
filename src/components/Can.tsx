
import { useAppSelector } from "@/hooks/useAppSelector";
import { createElement } from "react";
import { AbilityContext } from "@casl/react";
import { useEffect, useState } from "react";
import { defineAppAbility, AppAbility } from "@/utils/ability";

export const Can = (props: any) => {
  const { permissions } = useAppSelector((state) => state.auth);
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

  return createElement(AbilityContext.Provider, { value: ability }, 
    createElement(AbilityContext.Consumer, null, (context) => 
      props.do(context)
    )
  );
};
