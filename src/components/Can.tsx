
import { useAppSelector } from "@/hooks/useAppSelector";
import { createContextualCan } from "@casl/react";
import { useEffect, useState } from "react";
import { defineAppAbility, AppAbility } from "@/utils/ability";
import { AnyAbility, PureAbility } from "@casl/ability";

// Create the Can component that uses CASL properly
const Can = (props: any) => {
  const { permissions } = useAppSelector((state) => state.auth);
  const [ability, setAbility] = useState<AppAbility>(defineAppAbility());
  
  // Create the ContextualCan component inside the component to ensure proper typing
  const ContextualCan = createContextualCan<AnyAbility>(ability as any);

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

  // Return the ContextualCan component with props
  return <ContextualCan {...props} />;
};

export { Can };
