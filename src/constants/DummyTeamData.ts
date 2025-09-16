// DummyTeamMembersData.ts

export type TeamMember = {
  nameKey: string;
  positionKey: string;
  image: string;
};

/**
 * Dummy Team Members — uses translation keys
 */
export const teamMembers: TeamMember[] = [
  { nameKey: "team.john.name", positionKey: "team.john.position", image: "/me.jpg" },
  { nameKey: "team.jane.name", positionKey: "team.jane.position", image: "/me.jpg" },
  { nameKey: "team.alice.name", positionKey: "team.alice.position", image: "/me.jpg" },
  { nameKey: "team.bob.name", positionKey: "team.bob.position", image: "/me.jpg" },
];
