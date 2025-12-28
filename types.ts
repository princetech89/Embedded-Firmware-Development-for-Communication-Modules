
export interface ProtocolSignal {
  name: string;
  data: number[];
  color: string;
}

export interface DebugLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum FirmwareStatus {
  IDLE = 'IDLE',
  FLASHING = 'FLASHING',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR'
}
