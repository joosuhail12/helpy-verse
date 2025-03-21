
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
      // Convert permissions to the expected format before updating
      const formattedPermissions = permissions.map(perm => ({
        action: typeof perm.action === 'string' ? perm.action : perm.action[0],
        subject: perm.subject
      }));
      newAbility.update(formattedPermissions);
      setAbility(newAbility);
    }
  }, [permissions]);

  const ContextualCan = createContextualCan(ability);
  return <ContextualCan {...props} />;
};
