import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Property } from '../types';
import { Phone, Home, Trash2, RefreshCw, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { OfferStatus } from './OfferStatus';
import { ContactedStatus } from './ContactedStatus';
import * as Dialog from '@radix-ui/react-dialog';

interface PropertyCardProps {
  property: Property;
  onDelete?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  onStatusChange: (id: string, status: Property['offerStatus']) => void;
  onContactedChange: (id: string, contacted: boolean) => void;
  onDateChange?: (id: string, date: string) => void;
  isDeleted?: boolean;
}

export function PropertyCard({ 
  property, 
  onDelete,
  onRestore,
  onPermanentDelete,
  onStatusChange,
  onContactedChange,
  onDateChange,
  isDeleted = false
}: PropertyCardProps) {
  const navigate = useNavigate();
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const createdDate = new Date(property.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(createdDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!onDateChange) return;
    
    const newDate = e.target.value;
    const date = new Date(`${newDate}T12:00:00.000Z`);
    onDateChange(property.id, date.toISOString());
    setIsDateDialogOpen(false);
  };

  const getInputDate = () => {
    const date = new Date(property.createdAt);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting || !onDelete) return;
    
    setIsDeleting(true);
    try {
      onDelete();
    } finally {
      setTimeout(() => setIsDeleting(false), 500);
    }
  };

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting || !onRestore) return;
    
    setIsDeleting(true);
    try {
      onRestore();
    } finally {
      setTimeout(() => setIsDeleting(false), 500);
    }
  };

  const handlePermanentDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPermanentDelete) {
      onPermanentDelete();
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/property/${property.id}`)}
      className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 ease-in-out hover:translate-y-[-4px] hover:shadow-lg cursor-pointer ${
        isDeleted ? 'opacity-90' : ''
      }`}
    >
      <div className="aspect-[16/9] relative">
        <img
          src={property.imageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80"}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-white rounded-full shadow-md transform transition-all duration-200 ease-in-out hover:scale-110 hover:bg-red-50 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-gray-600 transition-colors duration-200 ease-in-out group-hover:text-red-600" />
              )}
            </button>
          )}
          {onRestore && (
            <button
              onClick={handleRestore}
              disabled={isDeleting}
              className="p-2 bg-white rounded-full shadow-md transform transition-all duration-200 ease-in-out hover:scale-110 hover:bg-green-50 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 text-gray-600 transition-colors duration-200 ease-in-out group-hover:text-green-600" />
              )}
            </button>
          )}
          {onPermanentDelete && (
            <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white rounded-full shadow-md transform transition-all duration-200 ease-in-out hover:scale-110 hover:bg-red-50 hover:shadow-lg active:scale-95 group"
                >
                  <Trash2 className="h-4 w-4 text-gray-600 transition-colors duration-200 ease-in-out group-hover:text-red-600" />
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay 
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <Dialog.Content 
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900 ml-3">
                      Confirm Permanent Delete
                    </Dialog.Title>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Are you sure you want to permanently delete this property? This action cannot be undone.
                    </p>
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        onClick={handlePermanentDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </div>
        {isDeleted && (
          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              Deleted
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{property.address}</h3>
          <Dialog.Root open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
            <Dialog.Trigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="group relative flex items-center px-3 py-1.5 bg-gradient-to-r from-ocean-50 to-ocean-100 rounded-full transition-all duration-200 hover:from-ocean-100 hover:to-ocean-200"
              >
                <Calendar className="h-4 w-4 mr-1.5 text-ocean-600 group-hover:text-ocean-700" />
                <span className="text-sm font-medium text-ocean-700 group-hover:text-ocean-800">
                  {formattedDate}
                </span>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <Dialog.Content 
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Edit Property Date
                </Dialog.Title>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Added
                    </label>
                    <input
                      type="date"
                      defaultValue={getInputDate()}
                      onChange={handleDateChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Dialog.Close asChild>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors">
                        Cancel
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Home className="h-4 w-4 mr-2.5 text-primary-500" />
            <span className="text-sm">{property.realtorName}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2.5 text-primary-500" />
            <span className="text-sm">{property.realtorNumber}</span>
          </div>
        </div>
        {!isDeleted && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <div onClick={e => e.stopPropagation()}>
              <ContactedStatus
                contacted={property.contacted}
                onStatusChange={(contacted) => onContactedChange(property.id, contacted)}
              />
            </div>
            <div onClick={e => e.stopPropagation()}>
              <OfferStatus
                status={property.offerStatus}
                onStatusChange={(status) => onStatusChange(property.id, status)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}