
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { ActionType, Permission } from '@/store/slices/authSlice';

// Define the types of subjects in our application
type Subjects = 'Article' | 'User' | 'Comment' | 'Contact' | 'Ticket' | 'Setting' | 'all';
type Actions = 'create' | 'read' | 'update' | 'delete' | 'archive' | 'manage';

// Define the type of Ability instance
export type AppAbility = Ability<[Actions, Subjects]>;
type DefinePermissions = (builder: AbilityBuilder<AppAbility>) => void;

// Create a function to define the default permissions
export const defineAppAbility = () => {
  const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

  // Default: users can read all resources
  can('read', 'all');

  return build({
    // Ability detection behavior options
    detectSubjectType: (subject) => subject.type
  });
};
