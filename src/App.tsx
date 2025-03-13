import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PropertyDetails } from './components/PropertyDetails';
import { Dashboard } from './components/Dashboard';
import { PropertyLeads } from './components/PropertyLeads';
import type { Property } from './types';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [deletedProperties, setDeletedProperties] = useState<Property[]>([]);

  const handleAddProperty = useCallback((data: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      offerStatus: null,
    };
    setProperties(prev => [newProperty, ...prev]);
  }, []);

  const handleEditProperty = useCallback((data: Property) => {
    setProperties(prev => prev.map(p => p.id === data.id ? { ...data } : p));
  }, []);

  const handleDeleteProperty = useCallback((id: string) => {
    setProperties(prev => {
      const propertyToDelete = prev.find(p => p.id === id);
      if (!propertyToDelete) return prev;
      
      setDeletedProperties(prevDeleted => {
        if (prevDeleted.some(p => p.id === id)) return prevDeleted;
        return [propertyToDelete, ...prevDeleted];
      });
      
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const handleRestoreProperty = useCallback((id: string) => {
    setDeletedProperties(prev => {
      const propertyToRestore = prev.find(p => p.id === id);
      if (!propertyToRestore) return prev;
      
      setProperties(prevProperties => [propertyToRestore, ...prevProperties]);
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const handlePermanentDelete = useCallback((id: string) => {
    setDeletedProperties(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleStatusChange = useCallback((id: string, status: Property['offerStatus']) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, offerStatus: status } : p
    ));
  }, []);

  const handleContactedChange = useCallback((id: string, contacted: boolean) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, contacted } : p
    ));
  }, []);

  const handleDateChange = useCallback((id: string, newDate: string) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, createdAt: newDate } : p
    ));
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route 
            path="/leads" 
            element={
              <PropertyLeads
                properties={properties}
                deletedProperties={deletedProperties}
                onAddProperty={handleAddProperty}
                onEditProperty={handleEditProperty}
                onDeleteProperty={handleDeleteProperty}
                onRestoreProperty={handleRestoreProperty}
                onPermanentDelete={handlePermanentDelete}
                onStatusChange={handleStatusChange}
                onContactedChange={handleContactedChange}
                onDateChange={handleDateChange}
              />
            }
          />
          <Route
            path="/property/:id"
            element={
              <PropertyDetails
                properties={[...properties, ...deletedProperties]}
                onEdit={handleEditProperty}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;