
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  name: string;
  details: string;
  isDefault: boolean;
}

export function PaymentMethodsModal({ isOpen, onClose }: PaymentMethodsModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'apple_pay',
      name: 'Apple Pay',
      details: 'Touch ID or Face ID',
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      name: 'Visa',
      details: '**** **** **** 1234',
      isDefault: false
    }
  ]);

  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleApplePaySetup = async () => {
    setLoading(true);
    
    // Simulate Apple Pay setup process
    setTimeout(() => {
      if (window.confirm('Simulate Apple Pay authentication with Touch ID/Face ID?')) {
        toast({
          title: "Apple Pay Configured",
          description: "Your Apple Pay is now ready for payments.",
        });
        
        const hasApplePay = paymentMethods.some(pm => pm.type === 'apple_pay');
        if (!hasApplePay) {
          setPaymentMethods(prev => [...prev, {
            id: Date.now().toString(),
            type: 'apple_pay',
            name: 'Apple Pay',
            details: 'Touch ID or Face ID',
            isDefault: prev.length === 0
          }]);
        }
      } else {
        toast({
          title: "Setup Cancelled",
          description: "Apple Pay setup was cancelled.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 2000);
  };

  const handleAddCard = () => {
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.name) {
      toast({
        title: "Error",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: cardForm.number.startsWith('4') ? 'Visa' : cardForm.number.startsWith('5') ? 'Mastercard' : 'Card',
      details: `**** **** **** ${cardForm.number.slice(-4)}`,
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods(prev => [...prev, newCard]);
    setCardForm({ number: '', expiry: '', cvv: '', name: '' });
    setShowAddCard(false);
    
    toast({
      title: "Card Added",
      description: "Your payment method has been added successfully.",
    });
  };

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    
    toast({
      title: "Default Payment Updated",
      description: "Your default payment method has been changed.",
    });
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed.",
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-ninja-gray shadow-2xl border-l border-gray-600 transform translate-x-0 transition-transform duration-300">
        {/* Header */}
        <div className="bg-ninja-gray-light px-6 py-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto">
          {/* Apple Pay Setup */}
          <div className="mb-6">
            <button
              onClick={handleApplePaySetup}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              )}
              {loading ? "Setting up..." : "Set up Apple Pay"}
            </button>
          </div>

          {/* Payment Methods List */}
          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-ninja-gray-light rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {method.type === 'apple_pay' ? (
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{method.name}</p>
                      <p className="text-gray-400 text-sm">{method.details}</p>
                      {method.isDefault && (
                        <span className="text-ninja-mint text-xs">Default</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => setDefaultPayment(method.id)}
                        className="text-ninja-mint hover:text-ninja-mint-dark text-sm"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => removePaymentMethod(method.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Card Button */}
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="w-full border-2 border-dashed border-gray-600 rounded-xl py-4 text-gray-400 hover:border-ninja-mint hover:text-ninja-mint transition-colors"
          >
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Credit Card
          </button>

          {/* Add Card Form */}
          {showAddCard && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardForm.number}
                  onChange={(e) => setCardForm(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
                  <input
                    type="text"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm(prev => ({ ...prev, expiry: e.target.value }))}
                    className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value }))}
                    className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white"
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardForm.name}
                  onChange={(e) => setCardForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-ninja-gray-light border border-gray-600 rounded-xl text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddCard}
                  className="flex-1 bg-ninja-mint hover:bg-ninja-mint-dark text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Add Card
                </button>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
