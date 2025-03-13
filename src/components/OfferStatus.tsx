import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { OfferStatus as OfferStatusType } from '../types';
import { clsx } from 'clsx';

interface OfferStatusProps {
  status: OfferStatusType;
  onStatusChange: (status: OfferStatusType) => void;
}

export function OfferStatus({ status, onStatusChange }: OfferStatusProps) {
  const buttons = [
    {
      status: 'pending' as const,
      icon: Clock,
      label: 'Pending',
      colors: {
        active: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        hover: 'hover:bg-yellow-50',
        icon: 'text-yellow-500',
      },
    },
    {
      status: 'accepted' as const,
      icon: CheckCircle2,
      label: 'Accepted',
      colors: {
        active: 'bg-green-100 text-green-700 border-green-300',
        hover: 'hover:bg-green-50',
        icon: 'text-green-500',
      },
    },
    {
      status: 'denied' as const,
      icon: XCircle,
      label: 'Denied',
      colors: {
        active: 'bg-red-100 text-red-700 border-red-300',
        hover: 'hover:bg-red-50',
        icon: 'text-red-500',
      },
    },
  ];

  return (
    <div className="flex space-x-2">
      {buttons.map((button) => {
        const isActive = status === button.status;
        const Icon = button.icon;
        
        return (
          <button
            key={button.status}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(isActive ? null : button.status);
            }}
            className={clsx(
              'inline-flex items-center px-3 py-1.5 rounded-full border transition-all duration-200 transform',
              'text-sm font-medium',
              isActive
                ? `${button.colors.active} scale-105`
                : `bg-white text-gray-600 border-gray-200 ${button.colors.hover}`,
              'hover:shadow-md active:scale-95'
            )}
          >
            <Icon className={clsx(
              'h-4 w-4 mr-1.5 transition-colors duration-200',
              isActive ? button.colors.icon : 'text-gray-400'
            )} />
            {button.label}
          </button>
        );
      })}
    </div>
  );
}