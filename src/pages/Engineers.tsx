import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Edit, 
  Trash2,
  Users,
  TrendingUp
} from "lucide-react";
import type { Engineer } from "@/types";

// Mock data
const mockEngineers: Engineer[] = [
  {
    id: "1",
    user_id: "user1",
    skills: ["React", "TypeScript", "Node.js"],
    experience_level: "senior",
    hourly_capacity: 40,
    current_utilization: 85,
    department: "Frontend",
    status: "busy",
    bio: "Full-stack developer with 5+ years experience",
    user: {
      id: "user1",
      email: "sarah.chen@company.com",
      full_name: "Sarah Chen",
      role: "engineer",
      created_at: "2023-01-15"
    }
  },
  {
    id: "2", 
    user_id: "user2",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    experience_level: "lead",
    hourly_capacity: 40,
    current_utilization: 70,
    department: "Backend",
    status: "available",
    bio: "Backend architect and team lead",
    user: {
      id: "user2",
      email: "mike.rodriguez@company.com", 
      full_name: "Mike Rodriguez",
      role: "engineer",
      created_at: "2022-08-20"
    }
  },
  {
    id: "3",
    user_id: "user3", 
    skills: ["React Native", "Swift", "Kotlin"],
    experience_level: "mid",
    hourly_capacity: 40,
    current_utilization: 60,
    department: "Mobile",
    status: "available",
    bio: "Mobile app developer",
    user: {
      id: "user3",
      email: "alex.kim@company.com",
      full_name: "Alex Kim", 
      role: "engineer",
      created_at: "2023-03-10"
    }
  }
];

export default function Engineers() {
  const [engineers, setEngineers] = useState<Engineer[]>(mockEngineers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = 
      engineer.user?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engineer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      engineer.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || engineer.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || engineer.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(engineers.map(e => e.department)));
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "default";
      case "busy": return "destructive"; 
      case "on_leave": return "secondary";
      default: return "outline";
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "junior": return "secondary";
      case "mid": return "default";
      case "senior": return "accent";
      case "lead": return "destructive";
      default: return "outline";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-destructive";
    if (utilization >= 75) return "text-warning";
    return "text-accent";
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engineers</h1>
          <p className="text-muted-foreground">
            Manage your engineering team and track capacity
          </p>
        </div>
        <Button className=" bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Engineer
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search engineers, skills, or departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Department: {filterDepartment === "all" ? "All" : filterDepartment}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border shadow-lg z-50">
                <DropdownMenuItem onClick={() => setFilterDepartment("all")}>
                  All Departments
                </DropdownMenuItem>
                {departments.map(dept => (
                  <DropdownMenuItem 
                    key={dept} 
                    onClick={() => setFilterDepartment(dept)}
                  >
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Status: {filterStatus === "all" ? "All" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border shadow-lg z-50">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("available")}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("busy")}>
                  Busy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("on_leave")}>
                  On Leave
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Engineers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEngineers.map((engineer) => (
          <Card key={engineer.id} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {engineer.user?.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{engineer.user?.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{engineer.department}</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border shadow-lg z-50">
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status and Experience */}
              <div className="flex items-center justify-between">
                <Badge variant={getStatusColor(engineer.status) as any}>
                  {engineer.status.replace('_', ' ')}
                </Badge>
                <Badge variant={getExperienceColor(engineer.experience_level) as any}>
                  {engineer.experience_level}
                </Badge>
              </div>

              {/* Bio */}
              {engineer.bio && (
                <p className="text-sm text-muted-foreground">{engineer.bio}</p>
              )}

              {/* Capacity Utilization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Capacity Utilization</span>
                  <span className={`font-medium ${getUtilizationColor(engineer.current_utilization)}`}>
                    {engineer.current_utilization}%
                  </span>
                </div>
                <Progress 
                  value={engineer.current_utilization} 
                  className="h-2"
                />
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {engineer.hourly_capacity}h weekly capacity
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Skills</span>
                <div className="flex flex-wrap gap-1">
                  {engineer.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {engineer.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{engineer.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground truncate">
                  {engineer.user?.email}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEngineers.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No engineers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setFilterDepartment("all");
              setFilterStatus("all");
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}