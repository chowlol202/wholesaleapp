import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, Plus, Upload, Home, Trash2, Building2, BarChart3, Calendar, X, ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';
import { PropertyForm } from './PropertyForm';
import { PropertyCard } from './PropertyCard';
import type { Property } from '../types';

interface PropertyLeadsProps {
  properties: Property[];
  deletedProperties: Property[];
  onAddProperty: (data: Omit<Property, 'id' | 'createdAt'>) => void;
  onEditProperty: (data: Property) => void;
  onDeleteProperty: (id: string) => void;
  onRestoreProperty: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onStatusChange: (id: string, status: Property['offerStatus']) => void;
  onContactedChange: (id: string, contacted: boolean) => void;
  onDateChange: (id: string, newDate: string) => void;
}

export function PropertyLeads({
  properties,
  deletedProperties,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onRestoreProperty,
  onPermanentDelete,
  onStatusChange,
  onContactedChange,
  onDateChange,
}: PropertyLeadsProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'deleted'>('leads');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProperties = useMemo(() => {
    const sourceProperties = activeTab === 'leads' ? properties : deletedProperties;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    return sourceProperties.filter(property => {
      if (search && !property.address.toLowerCase().includes(search.toLowerCase())) return false;
      if (!start && !end) return true;
      
      const propertyDate = new Date(property.createdAt);
      if (start && propertyDate < start) return false;
      if (end && propertyDate > end) return false;
      
      return true;
    });
  }, [properties, deletedProperties, search, startDate, endDate, activeTab]);

  const clearDateFilters = useCallback(() => {
    setStartDate('');
    setEndDate('');
  }, []);

  const parseNumericValue = useCallback((value: string): number => {
    if (!value || value === '') return 0;
    const cleanValue = value.replace(/[$,%]/g, '').trim();
    return Number(cleanValue) || 0;
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newProperties = results.data.map((row: any) => {
          const createdAt = row.createdAt 
            ? new Date(new Date(row.createdAt).setHours(12, 0, 0, 0)).toISOString()
            : new Date().toISOString();

          const cashOnCashReturn = parseNumericValue(row.cashOnCashReturn);

          return {
            id: crypto.randomUUID(),
            address: row.address?.trim() || '',
            realtorName: row.realtorName?.trim() || '',
            realtorNumber: row.realtorNumber?.trim() || '',
            askingPrice: parseNumericValue(row.askingPrice),
            purchasePrice: parseNumericValue(row.purchasePrice),
            interest: parseNumericValue(row.interest),
            monthlyPayment: parseNumericValue(row.monthlyPayment),
            downPayment: parseNumericValue(row.downPayment),
            cashFlow: parseNumericValue(row.cashFlow),
            cashOnCashReturn,
            rent: parseNumericValue(row.rent),
            contacted: row.contacted?.toLowerCase() === 'true',
            notes: row.notes?.trim() || '',
            imageUrl: row.imageUrl?.trim() || '',
            offerStatus: null,
            createdAt,
            monthlyInsurance: parseNumericValue(row.monthlyInsurance),
            monthlyPropertyTax: parseNumericValue(row.monthlyPropertyTax),
            monthlyHOA: parseNumericValue(row.monthlyHOA),
            monthlyOther: parseNumericValue(row.monthlyOther),
            capExPercentage: parseNumericValue(row.capExPercentage),
            managementPercentage: parseNumericValue(row.managementPercentage),
            vacancyPercentage: parseNumericValue(row.vacancyPercentage)
          };
        });

        const validProperties = newProperties.filter(p => p.address);
        const existingAddresses = new Set(properties.map(p => p.address.toLowerCase()));
        const uniqueProperties = validProperties.filter(p => !existingAddresses.has(p.address.toLowerCase()));
        
        uniqueProperties.forEach(property => {
          onAddProperty(property);
        });
        
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  }, [properties, parseNumericValue, onAddProperty]);

  const renderHeader = useMemo(() => (
    <header className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80')] opacity-[0.03] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-shine bg-[length:200px_200px] opacity-5 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-primary-800/90 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 shadow-lg ring-1 ring-white/20">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">Property Leads</h1>
                  <div className="flex items-center mt-2 space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary-200" />
                    <p className="text-primary-100">Track and manage your real estate investments</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="group flex items-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-lg ring-1 ring-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2 transform transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="font-medium">Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  ), [navigate]);

  const renderTabs = useMemo(() => (
    <div className="mb-8">
      <div className="sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as 'leads' | 'deleted')}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          <option value="leads">Active Leads ({properties.length})</option>
          <option value="deleted">Archived Leads ({deletedProperties.length})</option>
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('leads')}
                className={`${
                  activeTab === 'leads'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Home className="h-5 w-5 mr-2" />
                Active Leads
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === 'leads'
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {properties.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('deleted')}
                className={`${
                  activeTab === 'deleted'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Archived Leads
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === 'deleted'
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {deletedProperties.length}
                </span>
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="action-button import-button inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all duration-300 shadow-sm"
              >
                <Upload className="h-5 w-5 mr-2 text-gray-500 transition-colors group-hover:text-gray-700" />
                Import CSV
              </label>
              <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Trigger asChild>
                  <button className="action-button add-button inline-flex items-center px-4 py-2 rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Property
                  </button>
                </Dialog.Trigger>

                {isFormOpen && (
                  <PropertyForm
                    property={editingProperty}
                    onSubmit={editingProperty ? onEditProperty : onAddProperty}
                    onClose={() => {
                      setIsFormOpen(false);
                      setEditingProperty(null);
                    }}
                  />
                )}
              </Dialog.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [activeTab, properties.length, deletedProperties.length, isFormOpen, editingProperty, onAddProperty, onEditProperty, handleFileUpload]);

  const renderSearchAndFilter = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search properties by address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
        />
      </div>
      
      <div className="flex gap-2 items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
          />
        </div>
        <span className="text-gray-500">to</span>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
            min={startDate}
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={clearDateFilters}
            className="p-2.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  ), [search, startDate, endDate, clearDateFilters]);

  return (
    <>
      {renderHeader}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabs}
        {renderSearchAndFilter}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={() => {
                setEditingProperty(property);
                setIsFormOpen(true);
              }}
              onDelete={activeTab === 'leads' ? () => onDeleteProperty(property.id) : undefined}
              onRestore={activeTab === 'deleted' ? () => onRestoreProperty(property.id) : undefined}
              onPermanentDelete={activeTab === 'deleted' ? () => onPermanentDelete(property.id) : undefined}
              onStatusChange={onStatusChange}
              onContactedChange={onContactedChange}
              onDateChange={onDateChange}
              isDeleted={activeTab === 'deleted'}
            />
          ))}
          {filteredProperties.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {activeTab === 'leads' 
                  ? (properties.length === 0
                      ? "No properties added yet. Click 'Add Property' to get started!"
                      : "No properties match your search.")
                  : (deletedProperties.length === 0
                      ? "No archived properties"
                      : "No archived properties match your search.")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}