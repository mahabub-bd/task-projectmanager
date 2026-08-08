import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { FullPageLoader } from '../components/ui/loading-spinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useDeleteDivisionMutation, useGetDivisionQuery } from '../store/api';
import PageLoadingState from '../components/PageLoadingState';
import DivisionFormModal from '../components/divisions/DivisionFormModal';

export default function DivisionDetailsPage() {
  const { divisionId } = useParams<{ divisionId: string }>();
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
      // Navigate back to divisions list
      window.location.href = '/divisions';
    } catch (error: any) {
      console.error('Failed to delete division:', error);
    }
  };

  if (isLoading) {
    return <PageLoadingState message="Loading division details..." />;
  }

  if (isError || !division) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Division not found</h2>
        <Button onClick={() => (window.location.href = '/divisions')}>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Division Details</h1>
          <p className="text-muted-foreground">View and manage division information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => (window.location.href = '/divisions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Division Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{division.name}</CardTitle>
              {division.description && (
                <p className="text-muted-foreground mt-2">{division.description}</p>
              )}
            </div>
            {division.parent && (
              <Badge variant="secondary">
                Parent: {division.parent.name}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Created: {new Date(division.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {division.departments.map((dept: any) => (
                <div
                  key={dept.id}
                  className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/departments/${dept.id}`)}
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
