
import React from 'react';
import { EconomicEvent } from '../types';
import { CalendarDays, AlertCircle } from 'lucide-react';

interface EconomicCalendarProps {
  events: EconomicEvent[];
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ events }) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 h-full">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-blue-400" />
        Macro Economic Calendar
      </h4>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
               <div className={`flex flex-col items-center justify-center w-10 h-10 rounded border ${
                   event.impact === 'HIGH' ? 'bg-rose-900/20 border-rose-500/30 text-rose-400' : 
                   event.impact === 'MEDIUM' ? 'bg-amber-900/20 border-amber-500/30 text-amber-400' :
                   'bg-slate-800 border-slate-700 text-slate-400'
               }`}>
                  <span className="text-[10px] font-bold leading-none">{new Date(event.date).getDate()}</span>
                  <span className="text-[8px] uppercase leading-none mt-0.5">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
               </div>
               <div>
                  <div className="flex items-center gap-2">
                     <h5 className="text-sm font-medium text-slate-200">{event.event}</h5>
                     {event.impact === 'HIGH' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                  </div>
                  <p className="text-xs text-slate-500 flex gap-2">
                     <span>{event.country}</span>
                     <span>•</span>
                     <span>Fcst: {event.forecast}</span>
                  </p>
               </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded font-bold border ${
                event.impact === 'HIGH' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-slate-400 border-slate-700 bg-slate-800'
            }`}>
                {event.impact}
            </span>
          </div>
        ))}
        
        {events.length === 0 && (
            <div className="text-center text-xs text-slate-500 py-8">
                No high-impact events scheduled for this week.
            </div>
        )}
      </div>
    </div>
  );
};

export default EconomicCalendar;
