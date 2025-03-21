
import { Team } from "@/types/team";

export const mockTeams: Team[] = [
  {
    id: "1",
    name: "Support Team",
    icon: "Users",
    teamMembers: [
      { id: "1", name: "John Doe", email: "john@example.com", role: "Agent", status: "Active" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Lead", status: "Active" }
    ],
    routingStrategy: "round-robin",
    maxTotalTickets: 20,
    maxOpenTickets: 10,
    maxActiveChats: 5,
    createdAt: "2023-01-15T09:30:00Z",
    updatedAt: "2023-06-22T16:45:00Z",
    officeHours: {
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "17:00" }],
      thursday: [{ start: "09:00", end: "17:00" }],
      friday: [{ start: "09:00", end: "17:00" }],
      saturday: [],
      sunday: []
    },
    holidays: ["2023-12-25", "2024-01-01"],
    channels: {
      chat: "support",
      email: ["support@example.com"]
    }
  },
  {
    id: "2",
    name: "Product Team",
    icon: "Package",
    teamMembers: [
      { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "Agent", status: "Active" },
      { id: "4", name: "Sarah Williams", email: "sarah@example.com", role: "Lead", status: "Active" },
      { id: "5", name: "David Brown", email: "david@example.com", role: "Agent", status: "Away" }
    ],
    routingStrategy: "manual",
    createdAt: "2023-02-10T11:15:00Z",
    updatedAt: "2023-07-05T14:30:00Z",
    officeHours: {
      monday: [{ start: "08:00", end: "16:00" }],
      tuesday: [{ start: "08:00", end: "16:00" }],
      wednesday: [{ start: "08:00", end: "16:00" }],
      thursday: [{ start: "08:00", end: "16:00" }],
      friday: [{ start: "08:00", end: "16:00" }],
      saturday: [],
      sunday: []
    },
    holidays: ["2023-12-25", "2024-01-01"],
    channels: {
      email: ["product@example.com"]
    }
  },
  {
    id: "3",
    name: "Marketing Team",
    icon: "Megaphone",
    teamMembers: [
      { id: "6", name: "Emily Davis", email: "emily@example.com", role: "Agent", status: "Active" },
      { id: "7", name: "Alex Johnson", email: "alex@example.com", role: "Agent", status: "Active" }
    ],
    routingStrategy: "load-balanced",
    maxTotalTickets: 15,
    maxOpenTickets: 8,
    maxActiveChats: 3,
    createdAt: "2023-03-22T13:45:00Z",
    updatedAt: "2023-08-15T10:20:00Z",
    officeHours: {
      monday: [{ start: "10:00", end: "18:00" }],
      tuesday: [{ start: "10:00", end: "18:00" }],
      wednesday: [{ start: "10:00", end: "18:00" }],
      thursday: [{ start: "10:00", end: "18:00" }],
      friday: [{ start: "10:00", end: "16:00" }],
      saturday: [],
      sunday: []
    },
    holidays: ["2023-12-25", "2024-01-01", "2023-11-23"],
    channels: {
      chat: "marketing",
      email: ["marketing@example.com"]
    }
  }
];
