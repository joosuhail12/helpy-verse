import { useAppSelector } from "@/hooks/useAppSelector";
import { createContextualCan } from "@casl/react";
import { useEffect, useState } from "react";
import { defineAppAbility, AppAbility } from "@/utils/ability";

export const Can = (props: any) => {
  const { permissions } = useAppSelector((state) => state.auth);
  const [ability, setAbility] = useState<AppAbility>(defineAppAbility());

  useEffect(() => {
    const newAbility = defineAppAbility();
    newAbility.update(permissions); // Update CASL ability with new rules
    setAbility(newAbility);
  }, [permissions]);

  const ContextualCan = createContextualCan(() => ability);
  return <ContextualCan {...props} />;
};
