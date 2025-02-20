import { AbilityBuilder, createMongoAbility, MongoAbility } from "@casl/ability";

export type Actions = "read" | "create" | "update" | "delete";
export type Subjects = "User" | "Post" | "Comment" | "Nothing";

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const defineAppAbility = (): AppAbility => {
    const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can("read", "Nothing");

    return createMongoAbility(rules);
};

export const ability = defineAppAbility();
