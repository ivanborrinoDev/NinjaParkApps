import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../types/booking';
import { Review } from '../types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, Star, MessageSquare } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onReviewSubmit: (review: Omit<Review, 'id' | 'timestamp'>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReviewSubmit,
}) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentUser || !booking) return;

    if (rating === 0) {
      toast({
        title: "Errore",
        description: "Seleziona una valutazione da 1 a 5 stelle",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Errore",
        description: "Il commento deve essere di almeno 10 caratteri",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const reviewData: Omit<Review, 'id' | 'timestamp'> = {
        parkingId: booking.parkingId,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Utente',
        rating,
        comment: comment.trim(),
      };

      onReviewSubmit(reviewData);

      toast({
        title: "Recensione inviata!",
        description: "Grazie per il tuo feedback",
      });

      // Reset form
      setRating(0);
      setComment('');
      onClose();

    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile inviare la recensione. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-park-surface border-gray-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white text-xl font-semibold">
            Lascia una Recensione
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Booking Info */}
          <div className="bg-park-card rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">{booking.parkingName}</h3>
            <p className="text-gray-400 text-sm">
              Prenotazione del {new Date(booking.startDateTime).toLocaleDateString('it-IT')}
            </p>
          </div>

          {/* Rating Stars */}
          <div className="space-y-3">
            <label className="text-white font-medium">Valutazione *</label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const starRating = index + 1;
                const isActive = starRating <= (hoveredRating || rating);
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleStarClick(starRating)}
                    onMouseEnter={() => handleStarHover(starRating)}
                    onMouseLeave={handleStarLeave}
                    className="transition-colors"
                    disabled={loading}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        isActive 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="text-gray-400 ml-3">
                  {rating === 1 && "Pessimo"}
                  {rating === 2 && "Scarso"}
                  {rating === 3 && "Sufficiente"}
                  {rating === 4 && "Buono"}
                  {rating === 5 && "Ottimo"}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="text-white font-medium flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Commento *</span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descrivi la tua esperienza con questo parcheggio..."
              className="bg-park-card border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={4}
              maxLength={500}
              disabled={loading}
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>Minimo 10 caratteri</span>
              <span>{comment.length}/500</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-park-card text-white border-gray-600 hover:bg-gray-600"
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-park-mint text-park-dark hover:bg-opacity-90"
              disabled={loading || rating === 0 || comment.trim().length < 10}
            >
              {loading ? 'Invio...' : 'Invia Recensione'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};