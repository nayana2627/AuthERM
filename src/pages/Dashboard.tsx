import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { Lightbulb, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import type { DashboardStats, AIRecommendation } from "@/types";

// Mock data - replace with actual API calls
const mockStats: DashboardStats = {
  total_engineers: 24,
  active_projects: 8,
  total_assignments: 32,
  average_utilization: 78.5,
  projects_by_status: {
    active: 8,
    planning: 3,
    on_hold: 2,
    completed: 15
  },
  engineers_by_department: {
    Frontend: 8,
    Backend: 7,
    DevOps: 4,
    Mobile: 5
  },
  capacity_trends: [
    { date: "2024-01", utilization: 65 },
    { date: "2024-02", utilization: 72 },
    { date: "2024-03", utilization: 78.5 }
  ]
};

const mockRecommendations: AIRecommendation[] = [
  {
    type: "capacity_optimization",
    title: "Optimize Resource Allocation",
    description: "3 engineers in Frontend team are over-allocated while Backend team has capacity.",
    confidence: 0.89,
    actionable_items: [
      "Reassign 1 frontend engineer to backend project",
      "Review upcoming project timelines",
      "Consider hiring 1 additional frontend developer"
    ],
    priority: "high"
  },
  {
    type: "skill_gap",
    title: "Skills Development Needed",
    description: "React Native expertise is lacking for upcoming mobile projects.",
    confidence: 0.76,
    actionable_items: [
      "Provide React Native training to 2 mobile developers",
      "Consider external consultant for initial setup",
      "Allocate learning time in next sprint"
    ],
    priority: "medium"
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(mockRecommendations);
  const [isLoading, setIsLoading] = useState(false);

  // Prepare chart data
  const projectStatusData = Object.entries(stats.projects_by_status).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  const departmentData = Object.entries(stats.engineers_by_department).map(([dept, count]) => ({
    department: dept,
    engineers: count
  }));

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium': return <Clock className="w-4 h-4 text-warning" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-accent" />;
      default: return <Lightbulb className="w-4 h-4 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engineering Dashboard</h1>
          <p className="text-muted-foreground">
            Resource management and project insights
          </p>
        </div>
        <Button 
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardCards stats={stats} isLoading={isLoading} />

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Status Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engineers by Department */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Engineers by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engineers" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Trends */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Capacity Utilization Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.capacity_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="utilization" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-primary" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getPriorityIcon(rec.priority)}
                  <h3 className="font-semibold">{rec.title}</h3>
                  <Badge variant={getPriorityColor(rec.priority) as any}>
                    {rec.priority}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.round(rec.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm">{rec.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommended Actions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {rec.actionable_items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}