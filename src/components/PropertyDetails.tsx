import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarClock, StickyNote, Edit, Sparkles, Phone, User, PiggyBank } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { PropertyForm } from './PropertyForm';
import { PropertyEditForm } from './PropertyEditForm';
import { useLoanCalculator } from '../hooks/useLoanCalculator';
import { useCalculator } from '../hooks/useCalculator';
import type { Property } from '../types';

interface PropertyDetailsProps {
  properties: Property[];
  onEdit: (property: Property) => void;
}

export function PropertyDetails({ properties, onEdit }: PropertyDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = useMemo(() => properties.find(p => p.id === id), [properties, id]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notes, setNotes] = useState(property?.notes || '• ');
  
  // Calculator State
  const [purchasePrice, setPurchasePrice] = useState(property?.purchasePrice || 0);
  const [downPayment, setDownPayment] = useState(property?.downPayment || 0);
  const [interestRate, setInterestRate] = useState(property?.interest || 0);
  const [amortization, setAmortization] = useState(30);
  const [markupPercentage, setMarkupPercentage] = useState(15);
  const [monthlyRent, setMonthlyRent] = useState(property?.rent || 0);
  const [monthlyInsurance, setMonthlyInsurance] = useState(property?.monthlyInsurance || 0);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(property?.monthlyPropertyTax || 0);
  const [monthlyHOA, setMonthlyHOA] = useState(property?.monthlyHOA || 0);
  const [monthlyOther, setMonthlyOther] = useState(property?.monthlyOther || 0);
  const [capExPercentage, setCapExPercentage] = useState(property?.capExPercentage || 10);
  const [managementPercentage, setManagementPercentage] = useState(property?.managementPercentage || 10);
  const [vacancyPercentage, setVacancyPercentage] = useState(property?.vacancyPercentage || 0);
  const [monthlyFlow, setMonthlyFlow] = useState(property?.cashFlow || 0);
  const [cashOnCash, setCashOnCash] = useState(property?.cashOnCashReturn || 0);

  // Calculations
  const calculations = useLoanCalculator({
    purchasePrice,
    downPayment,
    interestRate,
    amortization
  });

  const cashOnCashCalculations = useCalculator({
    monthlyRent,
    monthlyPayment: calculations.monthlyPayment,
    downPayment,
    monthlyInsurance,
    monthlyPropertyTax,
    monthlyHOA,
    monthlyOther,
    capExPercentage,
    managementPercentage,
    vacancyPercentage
  });

  const suggestedPurchasePrice = useMemo(() => 
    property ? Math.round(property.askingPrice * (1 + markupPercentage / 100)) : 0
  , [property, markupPercentage]);

  const downPaymentPercentage = useMemo(() => 
    purchasePrice > 0 ? ((downPayment / purchasePrice) * 100).toFixed(1) : '0'
  , [purchasePrice, downPayment]);

  const handleCalculatorChange = useCallback((updates: Partial<Property>) => {
    if (!property) return;
    
    onEdit({
      ...property,
      ...updates,
      monthlyInsurance,
      monthlyPropertyTax,
      monthlyHOA,
      monthlyOther,
      capExPercentage,
      managementPercentage,
      vacancyPercentage,
      cashOnCashReturn: cashOnCash,
      cashFlow: monthlyFlow
    });
  }, [
    property,
    onEdit,
    monthlyInsurance,
    monthlyPropertyTax,
    monthlyHOA,
    monthlyOther,
    capExPercentage,
    managementPercentage,
    vacancyPercentage,
    cashOnCash,
    monthlyFlow
  ]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!property) return;

    let newValue = e.target.value;
    const lines = newValue.split('\n');
    
    // Process lines
    const processedLines = lines.map((line, index) => {
      // Always preserve bullet point for first line
      if (index === 0 && !line.startsWith('• ')) {
        return '• ' + line;
      }
      return line;
    });
    
    // Join lines back together
    newValue = processedLines.join('\n');
    
    // Ensure there's always at least one bullet point
    if (!newValue) {
      newValue = '• ';
    }
    
    setNotes(newValue);
    onEdit({ ...property, notes: newValue });
  }, [property, onEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || !property) return;

    e.preventDefault();
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const textAfterCursor = textarea.value.substring(cursorPosition);
    
    // Find the last bullet point position
    const lastBulletPoint = textBeforeCursor.lastIndexOf('• ');
    const textAfterLastBullet = textBeforeCursor.substring(lastBulletPoint + 2);
    
    // Only add a new bullet point if the current line isn't empty
    const shouldAddBullet = textAfterLastBullet.trim().length > 0;
    const newText = textBeforeCursor + '\n' + (shouldAddBullet ? '• ' : '') + textAfterCursor;
    
    setNotes(newText);
    onEdit({ ...property, notes: newText });
    
    // Calculate new cursor position
    const newPosition = cursorPosition + 1 + (shouldAddBullet ? 2 : 0);
    
    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    });
  }, [property, onEdit]);

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Property not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Property Image */}
      <div className="relative h-[400px] w-full mb-8 rounded-2xl overflow-hidden shadow-xl mt-8">
        <img
          src={property.imageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80"}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="flex justify-between items-end">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-3">{property.address}</h1>
              <div className="flex items-center space-x-6 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/90">{property.realtorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/90">{property.realtorNumber}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-white/90 font-medium">
                    ${property.askingPrice.toLocaleString()} Listed
                  </span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-white/90 font-medium">
                Added {new Date(property.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 px-4">
        <button
          onClick={() => navigate('/leads')}
          className="inline-flex items-center px-6 py-2.5 text-gray-600 hover:text-gray-900 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2.5" />
          Back to Properties
        </button>
        <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
          {!property.offerStatus && (
            <Dialog.Trigger asChild>
              <button className="inline-flex items-center px-6 py-2.5 text-primary-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-primary-200 hover:border-primary-300 hover:bg-primary-50">
                <Edit className="h-5 w-5 mr-2.5" />
                Edit Property
              </button>
            </Dialog.Trigger>
          )}

          {isFormOpen && (
            <PropertyEditForm
              property={property}
              onSubmit={(data) => {
                onEdit(data);
                setIsFormOpen(false);
              }}
              onClose={() => setIsFormOpen(false)}
            />
          )}
        </Dialog.Root>
      </div>

      <div className="space-y-6">
        {/* Creative Offer Calculator */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100/50">
          <div className="bg-white/40 border-b border-purple-100/50 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-purple-100/70 rounded-xl p-2.5">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Creative Offer Calculator</h2>
                <p className="text-sm text-gray-600 mt-0.5">Calculate and optimize your offer parameters</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Listed Price */}
              <div className="bg-white/60 rounded-xl p-4 border border-purple-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Listed Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={property.askingPrice}
                    disabled
                    className="block w-full pl-7 pr-3 py-3 bg-white/50 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:opacity-75"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div className="bg-white/60 rounded-xl p-4 border border-purple-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setDownPayment(value);
                        handleCalculatorChange({ downPayment: value });
                      }}
                      className="block w-full pl-7 pr-3 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-md">
                      {downPaymentPercentage}% of purchase price
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase Price */}
              <div className="bg-white/60 rounded-xl p-4 border border-purple-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setPurchasePrice(value);
                        handleCalculatorChange({ purchasePrice: value });
                      }}
                      className="block w-full pl-7 pr-3 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={markupPercentage}
                        onChange={(e) => setMarkupPercentage(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-sm border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                      />
                      <span className="text-sm text-purple-700">% markup</span>
                    </div>
                    <div className="text-sm font-medium text-purple-700">
                      Suggested: ${suggestedPurchasePrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="bg-white/60 rounded-xl p-4 border border-purple-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setInterestRate(value);
                      handleCalculatorChange({ interest: value });
                    }}
                    className="block w-full pl-3 pr-8 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Amortization */}
              <div className="md:col-span-2 bg-white/60 rounded-xl p-4 border border-purple-100/50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amortization Period</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <CalendarClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={amortization}
                    onChange={(e) => setAmortization(Number(e.target.value))}
                    className="block w-full pl-10 pr-12 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-500 sm:text-sm">Years</span>
                  </div>
                </div>
              </div>

              {/* Calculated Values */}
              {calculations && (
                <div className="md:col-span-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                  <h4 className="text-sm font-medium text-purple-100 mb-4">Calculated Values</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-purple-200 mb-1">Loan Amount</p>
                      <p className="text-2xl font-semibold">
                        ${calculations.loanAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-200 mb-1">Monthly Payment</p>
                      <p className="text-2xl font-semibold">
                        ${calculations.monthlyPayment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-200 mb-1">Annual Payment</p>
                      <p className="text-2xl font-semibold">
                        ${calculations.annualPayment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ROI Calculator */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-emerald-100/50">
            <div className="bg-white/40 border-b border-emerald-100/50 px-6 py-4">
              <div className="flex items-center">
                <div className="bg-emerald-100/70 rounded-xl p-2.5">
                  <PiggyBank className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">ROI</h2>
                  <p className="text-sm text-gray-600 mt-0.5">Return on Investment</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Monthly Rental Revenue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rental Revenue</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setMonthlyRent(value);
                      handleCalculatorChange({ rent: value });
                    }}
                    className="block w-full pl-7 pr-3 py-2.5 border border-emerald-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
                  />
                </div>
              </div>

              {/* Monthly Cash Flow */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Cash Flow</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={monthlyFlow}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setMonthlyFlow(value);
                      handleCalculatorChange({ cashFlow: value });
                    }}
                    className="block w-full pl-7 pr-3 py-2.5 border border-emerald-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
                  />
                </div>
              </div>

              {/* Annual Cash Flow */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Cash Flow</label>
                <div className="relative bg-emerald-50/50 rounded-lg py-2.5 px-3">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-800 font-medium">
                      ${(monthlyFlow * 12).toLocaleString()}
                    </span>
                    <span className="text-sm text-emerald-600">Monthly × 12</span>
                  </div>
                </div>
              </div>

              {/* Cash on Cash Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cash on Cash Return</label>
                <div className="relative">
                  <input
                    type="number"
                    value={cashOnCash}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setCashOnCash(value);
                      handleCalculatorChange({ cashOnCashReturn: value });
                    }}
                    className="block w-full pl-3 pr-8 py-2.5 border border-emerald-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[400px] flex flex-col">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <StickyNote className="h-5 w-5 text-gray-400" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">Notes</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <textarea
                value={notes}
                onChange={handleNotesChange}
                onKeyDown={handleKeyDown}
                placeholder="• Type your notes here..."
                className="w-full h-full px-6 py-4 text-gray-700 placeholder-gray-400 bg-white/50 border-0 focus:ring-0 resize-none font-medium"
                style={{
                  lineHeight: '1.8',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}