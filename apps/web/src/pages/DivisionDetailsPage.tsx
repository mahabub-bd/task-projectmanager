import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { useDeleteDivisionMutation, useGetDivisionQuery } from '../store/api';
import PageLoadingState from '../components/PageLoadingState';
import DivisionFormModal from '../components/divisions/DivisionFormModal';

export default function DivisionDetailsPage() {
  const { divisionId } = useParams<{ divisionId: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: response, isLoading, isError } = useGetDivisionQuery(divisionId || '', {
    skip: !divisionId,
  });

  const division = response;
  const [deleteDivision] = useDeleteDivisionMutation();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this division? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDivision(divisionId || '').unwrap();
      navigate('/divisions');
    } catch (error: any) {
      console.error('Failed to delete division:', error);
    }
  };

  const handleBack = () => {
    navigate('/divisions');
  };

  if (isLoading) {
    return <PageLoadingState message="Loading division details..." />;
  }

  if (isError || !division) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-4">
        <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Division not found</h2>
        <Button onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Divisions
        </Button>
      </div>
    );
  }

  const totalDepartments = division.departments?.length || 0;
  const totalUsers = division.users_count || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Division Details</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">View and manage division information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowEditModal(true)} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Edit</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Division
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Division
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Division Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl">{division.name}</CardTitle>
              {division.description && (
                <p className="text-muted-foreground mt-2 line-clamp-2">{division.description}</p>
              )}
            </div>
            {division.parent && (
              <Badge variant="secondary" className="self-start shrink-0">
                Parent: {division.parent.name}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Created: {new Date(division.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Total departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total users</p>
          </CardContent>
        </Card>
      </div>

      {/* Departments */}
      {division.departments && division.departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {division.departments.map((dept: any) => (
                <div
                  key={dept.id}
                  className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{dept.name}</p>
                    {dept.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{dept.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Division Form Modal */}
      <DivisionFormModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editingDivision={division}
      />
    </div>
  );
}
