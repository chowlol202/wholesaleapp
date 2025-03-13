import { Phone } from 'lucide-react';
import { clsx } from 'clsx';

interface ContactedStatusProps {
  contacted: boolean;
  onStatusChange: (contacted: boolean) => void;
}

export function ContactedStatus({ contacted, onStatusChange }: ContactedStatusProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onStatusChange(!contacted);
      }}
      className={clsx(
        'inline-flex items-center px-3 py-1.5 rounded-full border transition-all duration-200 transform',
        'text-sm font-medium hover:shadow-md active:scale-95',
        contacted
          ? 'bg-green-100 text-green-700 border-green-300 scale-105'
          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
      )}
    >
      <Phone className={clsx(
        'h-4 w-4 mr-1.5 transition-colors duration-200',
        contacted ? 'text-green-500' : 'text-yellow-500'
      )} />
      {contacted ? 'Contacted' : 'Not Contacted'}
    </button>
  );
}