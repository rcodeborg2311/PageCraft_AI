import React from 'react';
import { CheckCircle, Circle, Clock, Play } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <h2 className="text-lg font-semibold text-white">Build Steps</h2>
        <span className="ml-auto text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
          {steps.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              currentStep === step.id
                ? 'bg-white text-black shadow-lg'
                : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            {/* Step number */}
            <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === step.id
                ? 'bg-black text-white'
                : 'bg-zinc-700 text-zinc-300'
            }`}>
              {index + 1}
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {step.status === 'completed' ? (
                  <CheckCircle className={`w-5 h-5 ${currentStep === step.id ? 'text-black' : 'text-green-400'}`} />
                ) : step.status === 'in-progress' ? (
                  <Clock className={`w-5 h-5 ${currentStep === step.id ? 'text-black' : 'text-blue-400'}`} />
                ) : (
                  <Circle className={`w-5 h-5 ${currentStep === step.id ? 'text-black' : 'text-zinc-500'}`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm leading-tight ${
                  currentStep === step.id ? 'text-black' : 'text-white'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${
                  currentStep === step.id ? 'text-black/70' : 'text-zinc-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
            
            {/* Hover indicator */}
            {currentStep !== step.id && (
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-colors pointer-events-none" />
            )}
          </div>
        ))}
      </div>
      
      {steps.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Play className="w-8 h-8 text-zinc-600 mb-2" />
          <p className="text-zinc-500 text-sm">No steps yet</p>
          <p className="text-zinc-600 text-xs">Start building to see steps here</p>
        </div>
      )}
    </div>
  );
}