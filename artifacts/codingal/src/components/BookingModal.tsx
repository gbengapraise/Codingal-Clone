import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { EVENTS } from '@/lib/events';
import { useSubmitBooking } from '@/hooks/use-courses';

export function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const submitBooking = useSubmitBooking();

  const [formData, setFormData] = useState({
    childName: '',
    parentEmail: '',
    phone: '',
    grade: 'Grade 1-4'
  });

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setFormData({ childName: '', parentEmail: '', phone: '', grade: 'Grade 1-4' });
    };
    
    window.addEventListener(EVENTS.OPEN_BOOKING_MODAL, handleOpen);
    return () => window.removeEventListener(EVENTS.OPEN_BOOKING_MODAL, handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBooking.mutate(formData, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-display text-gray-900 mb-2">Class Booked!</h3>
                <p className="text-gray-600 text-lg">
                  We've sent the details to {formData.parentEmail}.<br/>
                  Get ready for an amazing coding journey!
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-display text-gray-900 mb-2">Book a Free Trial Class</h2>
                  <p className="text-gray-600">Give your child the superpower of coding. No credit card required.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Child's Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. Alex"
                      value={formData.childName}
                      onChange={e => setFormData({...formData, childName: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parent's Email</label>
                      <input
                        required
                        type="email"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="email@example.com"
                        value={formData.parentEmail}
                        onChange={e => setFormData({...formData, parentEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                      <input
                        required
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Child's Grade</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.grade}
                      onChange={e => setFormData({...formData, grade: e.target.value})}
                    >
                      <option>Grade 1-4</option>
                      <option>Grade 5-8</option>
                      <option>Grade 9-12</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitBooking.isPending}
                    className="w-full mt-6 py-4 px-6 rounded-xl font-bold text-white text-lg
                             bg-gradient-to-r from-primary to-[#ff5e6d] shadow-lg shadow-primary/30
                             hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 
                             active:translate-y-0 transition-all duration-200 flex items-center justify-center
                             disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitBooking.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Book Free Class Now"
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
