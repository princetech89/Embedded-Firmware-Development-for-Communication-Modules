
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ProtocolSignal } from '../types';

interface LogicAnalyzerProps {
  signals: ProtocolSignal[];
}

const LogicAnalyzer: React.FC<LogicAnalyzerProps> = ({ signals }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || signals.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, signals[0].data.length - 1])
      .range([0, width]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.5)
      .call(d3.axisBottom(x)
        .ticks(10)
        .tickSize(height)
        .tickFormat(() => "")
      );

    signals.forEach((signal, idx) => {
      const signalGroup = g.append("g");
      const signalHeight = height / signals.length;
      const yOffset = idx * signalHeight;

      const y = d3.scaleLinear()
        .domain([0, 1])
        .range([yOffset + signalHeight - 10, yOffset + 10]);

      // Draw Signal Path
      const line = d3.line<number>()
        .x((_, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveStepAfter);

      signalGroup.append("path")
        .datum(signal.data)
        .attr("fill", "none")
        .attr("stroke", signal.color)
        .attr("stroke-width", 2)
        .attr("d", line);

      // Label
      signalGroup.append("text")
        .attr("x", -10)
        .attr("y", yOffset + signalHeight / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", signal.color)
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text(signal.name);
    });

    // X-axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(10))
      .attr("color", "#94a3b8");

  }, [signals]);

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Logic Analyzer (SPI Capture)</h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            TRIGGER READY
          </span>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-[300px]"></svg>
    </div>
  );
};

export default LogicAnalyzer;
