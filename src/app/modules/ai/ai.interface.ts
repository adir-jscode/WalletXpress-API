export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChatRequest {
  message: string;
  history?: IChatMessage[];
}
