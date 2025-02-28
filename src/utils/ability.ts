
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { ActionType, Permission } from '@/store/slices/authSlice';

// Define the types of subjects in our application
export type Subjects = 'Article' | 'User' | 'Comment' | 'Contact' | 'Ticket' | 'Setting' | 'all';
export type Actions = 'create' | 'read' | 'update' | 'delete' | 'archive' | 'manage';

// Define the type of Ability instance
export type AppAbility = Ability<[Actions, Subjects]>;
export type DefinePermissions = (builder: AbilityBuilder<AppAbility>) => void;

// Define a subject type guard
export function subjectType(subject: any): Subjects {
  if (!subject) return 'all';
  
  return subject.type || 
         (subject.constructor && subject.constructor.modelName) || 
         typeof subject === 'string' ? subject : 'all';
}

// Create a function to define the default permissions
export const defineAppAbility = () => {
  const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

  // Default: users can read all resources
  can('read', 'all');

  return build({
    // Ability detection behavior options
    detectSubjectType: subjectType
  });
};
