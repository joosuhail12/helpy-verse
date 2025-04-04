
import { AbilityBuilder, AbilityClass, InferSubjects, PureAbility } from "@casl/ability";

// Create/export the ActionType type if it doesn't already exist
export type ActionType = "create" | "read" | "update" | "delete" | "archive" | "manage";

type Subjects = InferSubjects<{ subject: string } | 'all'>;
export type AppAbility = PureAbility<[ActionType, Subjects]>;

export const defineAppAbility = () => {
  const { can, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>);

  // Define default abilities (if any)
  // can('read', 'Article'); // Example: can read articles

  return build();
};
