
import { AbilityBuilder, createMongoAbility } from "@casl/ability";

// Define types for actions and subjects
export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type SubjectType = 'all' | 'User' | 'Teammate' | 'Team' | 'Company' | 'Contact' | 'Ticket';

// Define the AppAbility type for our application
export type AppAbility = ReturnType<typeof defineAppAbility>;

// Function to create a new ability instance
export const defineAppAbility = () => {
  const { can: allow, build } = new AbilityBuilder(createMongoAbility);

  // By default, don't allow any actions
  // Permissions will be added when user logs in

  return build();
};
