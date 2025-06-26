
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trophy, Star, Target } from 'lucide-react';
import { publicParkingService } from '../lib/publicParkingService';
import { UserReliabilityScore } from '../types/publicParking';

interface UserBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserBadgesModal: React.FC<UserBadgesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();

  if (!isOpen || !currentUser) return null;

  const userScore = publicParkingService.getUserScore(currentUser.uid);

  const defaultScore: UserReliabilityScore = {
    userId: currentUser.uid,
    totalReports: 0,
    confirmedReports: 0,
    reliabilityScore: 100,
    badges: []
  };

  const score = userScore || defaultScore;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Eccellente';
    if (score >= 70) return 'Buono';
    if (score >= 50) return 'Discreto';
    return 'Migliorabile';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] bg-park-surface border-park-card flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <CardTitle className="text-xl font-montserrat text-white flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-park-mint" />
            <span>I Miei Achievement</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <ScrollArea className="flex-1 px-6">
          <CardContent className="space-y-6 pb-6">
          {/* Reliability Score */}
          <div className="bg-park-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-park-mint" />
                <span className="font-medium text-white">Punteggio Affidabilità</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(score.reliabilityScore)}`}>
                {score.reliabilityScore}%
              </div>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              {getScoreDescription(score.reliabilityScore)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-park-mint rounded-full h-2 transition-all duration-300"
                style={{ width: `${score.reliabilityScore}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-park-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-park-mint">{score.totalReports}</div>
              <div className="text-sm text-gray-300">Segnalazioni Totali</div>
            </div>
            <div className="bg-park-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{score.confirmedReports}</div>
              <div className="text-sm text-gray-300">Confermate</div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
              <Target className="w-5 h-5 text-park-mint" />
              <span>Badge Ottenuti ({score.badges.length})</span>
            </h3>
            
            {score.badges.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-3">🎯</div>
                <p className="text-gray-400">Nessun badge ancora!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Inizia a segnalare parcheggi per ottenere i tuoi primi badge
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {score.badges.map((badge) => (
                  <div key={badge.id} className="bg-park-card rounded-lg p-3 border border-park-mint/30">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="font-medium text-white text-sm">{badge.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{badge.description}</div>
                      <div className="text-xs text-park-mint mt-2">
                        {badge.unlockedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next Goals */}
          <div className="bg-park-mint/10 border border-park-mint/30 rounded-lg p-4">
            <h4 className="text-park-mint font-medium mb-2">Prossimi Obiettivi:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              {score.totalReports === 0 && (
                <li>• Fai la tua prima segnalazione per ottenere "Primo Segnalatore" 🚗</li>
              )}
              {score.totalReports < 10 && (
                <li>• Raggiungi 10 segnalazioni per "Segnalatore Affidabile" ⭐</li>
              )}
              {score.totalReports < 50 && (
                <li>• Raggiungi 50 segnalazioni per "Super Segnalatore" 🏆</li>
              )}
              {score.reliabilityScore < 100 && score.totalReports >= 20 && (
                <li>• Mantieni il 100% di affidabilità per "Precisione Perfetta" 💎</li>
              )}
            </ul>
          </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};
