
import React, { useState } from 'react';
import { 
  Cpu, 
  Settings, 
  Terminal, 
  Activity, 
  Wifi, 
  Bluetooth, 
  Zap, 
  Code,
  Layers,
  Search
} from 'lucide-react';
import LogicAnalyzer from './LogicAnalyzer';
import FirmwareAssistant from './FirmwareAssistant';
import { ProtocolSignal, DebugLog, FirmwareStatus } from '../types';

const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<FirmwareStatus>(FirmwareStatus.RUNNING);
  const [activeTab, setActiveTab] = useState<'monitor' | 'debug' | 'code'>('monitor');

  // Sample SPI Signals
  const [signals] = useState<ProtocolSignal[]>([
    { name: 'SCLK', color: '#60a5fa', data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
    { name: 'MOSI', color: '#facc15', data: [0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1] },
    { name: 'MISO', color: '#f472b6', data: [1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0] },
    { name: 'CS', color: '#ef4444', data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] },
  ]);

  const [logs] = useState<DebugLog[]>([
    { id: '1', timestamp: '10:04:22.45', level: 'INFO', message: 'System boot complete. CPU freq: 168MHz' },
    { id: '2', timestamp: '10:04:22.48', level: 'DEBUG', message: 'Initialized SPI1 in Master mode @ 42MHz' },
    { id: '3', timestamp: '10:04:23.12', level: 'INFO', message: 'Detected LoRa Module (SX1276) on SPI1' },
    { id: '4', timestamp: '10:04:25.88', level: 'WARN', message: 'High jitter detected on UART2 RX line' },
    { id: '5', timestamp: '10:04:28.01', level: 'INFO', message: 'Establishing MQTT link via ESP32 Gateway...' },
  ]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f19]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">FirmwarePro</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem 
            icon={<Activity className="w-5 h-5" />} 
            label="Monitor" 
            active={activeTab === 'monitor'} 
            onClick={() => setActiveTab('monitor')} 
          />
          <SidebarItem 
            icon={<Terminal className="w-5 h-5" />} 
            label="Serial Console" 
            active={activeTab === 'debug'} 
            onClick={() => setActiveTab('debug')} 
          />
          <SidebarItem 
            icon={<Code className="w-5 h-5" />} 
            label="Code Analysis" 
            active={activeTab === 'code'} 
            onClick={() => setActiveTab('code')} 
          />
          <SidebarItem icon={<Layers className="w-5 h-5" />} label="Memory Map" />
          <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">Target: STM32F4</span>
            <span className={`w-2 h-2 rounded-full ${status === FirmwareStatus.RUNNING ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          </div>
          <p className="text-sm font-medium text-slate-200">System Voltage: 3.28V</p>
          <p className="text-sm font-medium text-slate-200">CPU Load: 12%</p>
          <button className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 rounded-lg transition-colors">
            Reboot Device
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Communication Interface Dashboard</h2>
            <p className="text-slate-400">Real-time telemetry and protocol analysis</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
              <Zap className="w-4 h-4" /> Flash Firmware
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logic Analyzer Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <LogicAnalyzer signals={signals} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                icon={<Wifi className="w-6 h-6 text-blue-400" />} 
                title="LoRa Link Quality" 
                value="88%" 
                sub="RSSI: -94dBm"
                trend="+2%"
              />
              <StatCard 
                icon={<Bluetooth className="w-6 h-6 text-purple-400" />} 
                title="BLE Status" 
                value="Advertising" 
                sub="Last connection: 2m ago"
              />
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Debug Console Output</h3>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto space-y-2 border border-slate-800">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-4">
                    <span className="text-slate-500 whitespace-nowrap">[{log.timestamp}]</span>
                    <span className={`font-bold whitespace-nowrap w-16 ${
                      log.level === 'INFO' ? 'text-blue-400' : 
                      log.level === 'WARN' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Assistant Panel */}
          <div className="lg:col-span-1 h-[calc(100vh-250px)] min-h-[500px]">
            <FirmwareAssistant />
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const SidebarItem = ({ icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ icon, title, value, sub, trend }: any) => (
  <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl flex items-start gap-4 shadow-sm hover:border-slate-500 transition-colors">
    <div className="bg-slate-800 p-3 rounded-lg">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-slate-400 text-sm font-medium">{title}</h4>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && <span className="text-emerald-400 text-xs font-semibold">{trend}</span>}
      </div>
      <p className="text-slate-500 text-xs mt-1">{sub}</p>
    </div>
  </div>
);

export default Dashboard;
