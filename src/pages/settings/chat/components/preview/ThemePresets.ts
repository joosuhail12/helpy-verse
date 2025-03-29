
export interface ThemePreset {
  name: string;
  description: string;
  colors: {
    primaryColor: string;
    headerColor: string;
    messageBoxColor: string;
    userMessageColor: string;
    agentMessageColor: string;
  };
  preview?: {
    light: string;
    dark: string;
  };
}

export const themePresets: ThemePreset[] = [
  {
    name: "Classic Purple",
    description: "Our default theme with gentle purple tones",
    colors: {
      primaryColor: "#9b87f5",
      headerColor: "#9b87f5",
      messageBoxColor: "#f9f9f9",
      userMessageColor: "#9b87f5",
      agentMessageColor: "#f1f1f1"
    }
  },
  {
    name: "Ocean Blue",
    description: "Calming blue tones for a professional look",
    colors: {
      primaryColor: "#0EA5E9",
      headerColor: "#0EA5E9",
      messageBoxColor: "#f5f9fc",
      userMessageColor: "#0EA5E9",
      agentMessageColor: "#e6f4fa"
    }
  },
  {
    name: "Forest Green",
    description: "Natural green palette for a fresh experience",
    colors: {
      primaryColor: "#10B981",
      headerColor: "#10B981",
      messageBoxColor: "#f5fbf8",
      userMessageColor: "#10B981",
      agentMessageColor: "#e6f7f1"
    }
  },
  {
    name: "Sunset Orange",
    description: "Warm orange tones for a friendly interface",
    colors: {
      primaryColor: "#F97316",
      headerColor: "#F97316",
      messageBoxColor: "#fef8f5",
      userMessageColor: "#F97316",
      agentMessageColor: "#fef0e7"
    }
  },
  {
    name: "Berry Purple",
    description: "Rich purple tones for a premium feel",
    colors: {
      primaryColor: "#8B5CF6",
      headerColor: "#8B5CF6",
      messageBoxColor: "#f9f7fe",
      userMessageColor: "#8B5CF6",
      agentMessageColor: "#f1edfc"
    }
  },
  {
    name: "Rose Pink",
    description: "Soft pink tones for a friendly and approachable look",
    colors: {
      primaryColor: "#F43F5E",
      headerColor: "#F43F5E", 
      messageBoxColor: "#fef6f8",
      userMessageColor: "#F43F5E",
      agentMessageColor: "#fce7ec"
    }
  },
  {
    name: "Gray Neutral",
    description: "Clean and minimal gray design for a timeless look",
    colors: {
      primaryColor: "#4B5563",
      headerColor: "#4B5563",
      messageBoxColor: "#f9f9f9",
      userMessageColor: "#4B5563",
      agentMessageColor: "#f1f1f1"
    }
  },
  {
    name: "High Contrast",
    description: "Accessible theme with high contrast colors",
    colors: {
      primaryColor: "#000000",
      headerColor: "#000000",
      messageBoxColor: "#ffffff",
      userMessageColor: "#000000",
      agentMessageColor: "#f0f0f0"
    }
  }
];
