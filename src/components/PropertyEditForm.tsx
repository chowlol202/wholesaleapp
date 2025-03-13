import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { Property } from '../types';

interface PropertyEditFormProps {
  property: Property;
  onSubmit: (data: Property) => void;
  onClose: () => void;
}

export function PropertyEditForm({ property, onSubmit, onClose }: PropertyEditFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      imageUrl: property.imageUrl,
      address: property.address,
      realtorName: property.realtorName,
      realtorNumber: property.realtorNumber,
      askingPrice: property.askingPrice,
    },
  });

  return (
    <Dialog.Content className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Dialog.Title className="text-2xl font-semibold text-gray-900">
            Edit Property Details
          </Dialog.Title>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit((data) => {
          onSubmit({
            ...property,
            imageUrl: data.imageUrl,
            address: data.address,
            realtorName: data.realtorName,
            realtorNumber: data.realtorNumber,
            askingPrice: Number(data.askingPrice),
          });
        })} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                {...register('imageUrl')}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                {...register('address')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Realtor Name</label>
              <input
                {...register('realtorName')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Realtor Number</label>
              <input
                {...register('realtorNumber')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asking Price ($)</label>
              <input
                type="number"
                {...register('askingPrice')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Dialog.Content>
  );
}