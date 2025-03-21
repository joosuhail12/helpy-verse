
import { AbilityBuilder, createMongoAbility, MongoAbility } from "@casl/ability";

// Define the allowed action types explicitly to match what's used in the application
export type Actions = "read" | "create" | "update" | "delete" | "manage";
export type Subjects = 
  | "User" 
  | "Post" 
  | "Comment" 
  | "Nothing" 
  | "Ticket" 
  | "Contact" 
  | "Company" 
  | "Team" 
  | "Teammate" 
  | string;

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const defineAppAbility = (): AppAbility => {
    const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can("read", "Nothing");

    return createMongoAbility(rules);
};

export const ability = defineAppAbility();
