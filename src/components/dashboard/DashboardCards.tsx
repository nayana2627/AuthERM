import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, FolderKanban, Calendar, BarChart3 } from "lucide-react";
import type { DashboardStats } from "@/types";

interface DashboardCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function DashboardCards({ stats, isLoading }: DashboardCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const utilizationTrend = stats.capacity_trends.length > 1 
    ? stats.capacity_trends[stats.capacity_trends.length - 1].utilization - 
      stats.capacity_trends[stats.capacity_trends.length - 2].utilization
    : 0;

  const cards = [
    {
      title: "Total Engineers",
      value: stats.total_engineers,
      description: "Active team members",
      icon: Users,
      trend: null,
      color: "bg-primary"
    },
    {
      title: "Active Projects", 
      value: stats.active_projects,
      description: "Currently in progress",
      icon: FolderKanban,
      trend: null,
      color: "bg-accent"
    },
    {
      title: "Total Assignments",
      value: stats.total_assignments, 
      description: "Resource allocations",
      icon: Calendar,
      trend: null,
      color: "bg-warning"
    },
    {
      title: "Average Utilization",
      value: `${Math.round(stats.average_utilization)}%`,
      description: utilizationTrend > 0 
        ? `+${utilizationTrend.toFixed(1)}% from last period`
        : utilizationTrend < 0 
        ? `${utilizationTrend.toFixed(1)}% from last period`
        : "No change from last period",
      icon: BarChart3,
      trend: utilizationTrend,
      color: "bg-destructive",
      progress: stats.average_utilization
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-2xl font-bold">{card.value}</div>
                {card.trend !== null && (
                  <Badge variant={card.trend > 0 ? "default" : "destructive"} className="text-xs">
                    {card.trend > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(card.trend).toFixed(1)}%
                  </Badge>
                )}
              </div>
              
              {card.progress !== undefined && (
                <div className="mb-2">
                  <Progress 
                    value={card.progress} 
                    className="h-2"
                  />
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}