
import { useAppSelector } from "@/hooks/useAppSelector";
import { createContextualCan } from "@casl/react";
import { useEffect, useState } from "react";
import { defineAppAbility, AppAbility } from "@/utils/ability";

export const Can = (props: any) => {
  const { permissions } = useAppSelector((state) => state.auth);
  const [ability, setAbility] = useState<AppAbility>(defineAppAbility());

  useEffect(() => {
    if (permissions && Array.isArray(permissions)) {
      const newAbility = defineAppAbility();
      
      // Only proceed if permissions exist
      if (permissions.length > 0) {
        // Convert permissions to the expected format
        const formattedPermissions = permissions.map(perm => ({
          action: perm.action as "read" | "create" | "update" | "delete",
          subject: perm.subject as string
        }));
        
        newAbility.update(formattedPermissions);
      }
      
      setAbility(newAbility);
    }
  }, [permissions]);

  // Use the Can component with the current ability
  const ContextualCan = createContextualCan(ability.rules);
  return <ContextualCan {...props} />;
};
