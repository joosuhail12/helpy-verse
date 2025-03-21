
import { useAppSelector } from "@/hooks/useAppSelector";
import { createContextualCan } from "@casl/react";
import { useEffect, useState } from "react";
import { defineAppAbility, AppAbility } from "@/utils/ability";
import { PureAbility } from "@casl/ability";

// Create the ContextualCan component once outside the component render
const ContextualCan = createContextualCan(PureAbility);

export const Can = (props: any) => {
  const { permissions } = useAppSelector((state) => state.auth);
  const [ability, setAbility] = useState<AppAbility>(defineAppAbility());

  useEffect(() => {
    if (permissions && Array.isArray(permissions)) {
      const newAbility = defineAppAbility();
      
      // Only proceed if permissions exist
      if (permissions.length > 0) {
        // Convert permissions to the expected format for CASL
        const formattedPermissions = permissions.map(perm => ({
          action: perm.action as "read" | "create" | "update" | "delete",
          subject: perm.subject as string
        }));
        
        newAbility.update(formattedPermissions);
      }
      
      setAbility(newAbility);
    }
  }, [permissions]);

  // Pass the ability to ContextualCan as a prop instead of using it as a component
  return <ContextualCan ability={ability} {...props} />;
};
