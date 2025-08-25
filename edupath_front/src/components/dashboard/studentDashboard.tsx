import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Trophy, Flame, Star, Target, Play, Lock } from "lucide-react";
import { type UserProgress } from "../../data/types";
import { mathTopics } from "../../data/mathTopics";
import { availableBadges } from "../../data/badges";

interface StudentDashboardProps {
  user: UserProgress;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const nextLevelXP = (user.level + 1) * 500;
  const currentLevelXP = user.level * 500;
  const progressToNext = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="space-y-6">
      {/* Stats de usuario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Nivel</p>
                <p className="text-2xl font-bold">{user.level}</p>
              </div>
              <Trophy className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">XP Total</p>
                <p className="text-2xl font-bold">{user.xp}</p>
              </div>
              <Star className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Puntos</p>
                <p className="text-2xl font-bold">{user.totalPoints}</p>
              </div>
              <Target className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Racha</p>
                <p className="text-2xl font-bold">{user.streakDays} días</p>
              </div>
              <Flame className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progreso del nivel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
            <CardDescription>
              {nextLevelXP - user.xp} XP para el siguiente nivel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nivel {user.level}</span>
                <span>Nivel {user.level + 1}</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {user.xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
              </p>
            </div>
            
            {/* Rutas de aprendizaje */}
            <div className="space-y-3">
              <h4 className="font-medium">Rutas de Aprendizaje</h4>
              {mathTopics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${topic.color} ${topic.unlocked ? '' : 'opacity-50'}`}>
                      {topic.unlocked ? <Play className="h-4 w-4 text-white" /> : <Lock className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{topic.progress}%</p>
                    <Progress value={topic.progress} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insignias */}
        <Card>
          <CardHeader>
            <CardTitle>Insignias</CardTitle>
            <CardDescription>
              Insignias que has desbloqueado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {availableBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    badge.earned 
                      ? 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`text-2xl mb-1 ${badge.earned ? '' : 'grayscale'}`}>
                    {badge.icon === 'baby' && '👶'}
                    {badge.icon === 'calculator' && '🧮'}
                    {badge.icon === 'flame' && '🔥'}
                    {badge.icon === 'crown' && '👑'}
                    {badge.icon === 'compass' && '🧭'}
                  </div>
                  <p className="text-xs font-medium">{badge.name}</p>
                  {badge.earned && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      ¡Desbloqueada!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acción rápida */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">¡Continúa tu aventura!</h3>
            <p className="text-muted-foreground mb-4">
              Completa más ejercicios de multiplicación para desbloquear la división
            </p>
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              <Play className="h-4 w-4 mr-2" />
              Continuar Aprendiendo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}