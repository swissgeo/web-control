import type { UserProfile } from "oidc-client-ts";

export interface Profile {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId?: string;
  unitId?: string;
  roles?: string[];
  isSuperUser: boolean;
}

export const EMPTY_PROFILE: Profile = {
  sub: "",
  firstName: "",
  lastName: "",
  email: "",
  organizationId: undefined,
  unitId: undefined,
  roles: [],
  isSuperUser: false,
};

export function profileFromUserProfile(
  profile: UserProfile | undefined,
  superuserGroup: string,
): Profile {
  const groups = cognitoGroupsFromProfile(profile) ?? [];
  return {
    sub: stringClaim(profile, "sub"),
    firstName: stringClaim(profile, "given_name"),
    lastName: stringClaim(profile, "family_name"),
    email: stringClaim(profile, "email"),
    organizationId: idFromGroups(groups, "O_"),
    unitId: idFromGroups(groups, "U_"),
    roles: cognitoRolesFromProfile(profile) ?? [],
    isSuperUser: superuserGroup ? groups.includes(superuserGroup) : false,
  };
}

function stringClaim(profile: UserProfile | undefined, claim: string): string {
  const value = profile?.[claim];
  return typeof value === "string" ? value : "";
}

function cognitoGroupsFromProfile(
  profile: UserProfile | undefined,
): string[] | undefined {
  const groups = profile?.["cognito:groups"];
  if (!Array.isArray(groups)) {
    return undefined;
  }
  return groups.every((group) => typeof group === "string")
    ? groups
    : undefined;
}

function cognitoRolesFromProfile(
  profile: UserProfile | undefined,
): string[] | undefined {
  const roles = profile?.["custom:roles"];
  if (!Array.isArray(roles)) {
    return undefined;
  }
  return roles.every((role) => typeof role === "string") ? roles : undefined;
}

function idFromGroups(groups: string[], prefix: string): string | undefined {
  const group = groups.find((currentGroup) => currentGroup.startsWith(prefix));
  return group ? group.substring(prefix.length) : undefined;
}
