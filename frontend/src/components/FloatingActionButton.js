import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  MessageCircle, 
  X, 
  Mail, 
  Phone, 
  Video, 
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const actions = [
    { icon: <Mail className="h-5 w-5" />, label: 'Email Support', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: <Phone className="h-5 w-5" />, label: 'Call Us', color: 'bg-green-500 hover:bg-green-600' },
    { icon: <Video className="h-5 w-5" />, label: 'Video Chat', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: <HelpCircle className="h-5 w-5" />, label: 'Help Center', color: 'bg-orange-500 hover:bg-orange-600' }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center space-x-3"
            style={{ 
              animationDelay: `${index * 50}ms`,
              transform: isOpen ? 'translateX(0)' : 'translateX(20px)'
            }}
          >
            <span className="text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap">
              {action.label}
            </span>
            <Button
              size="sm"
              className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              {action.icon}
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </Button>

      {/* Pulse Effect */}
      {!isOpen && (
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20" />
      )}
    </div>
  );
};

export default FloatingActionButton;
