import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useRemoveProjectMemberMutation } from '@/store/api';
import { Building2, User as UserIcon, Users, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface ProjectTeamProps {
  project: any;
  members: any[];
}

function getUserInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getUserAvatarColor(name: string): string {
  const colors = [
    'bg-blue-600 dark:bg-blue-500',
    'bg-green-600 dark:bg-green-500',
    'bg-purple-600 dark:bg-purple-500',
    'bg-orange-600 dark:bg-orange-500',
    'bg-pink-600 dark:bg-pink-500',
    'bg-teal-600 dark:bg-teal-500',
    'bg-indigo-600 dark:bg-indigo-500',
    'bg-red-600 dark:bg-red-500',
    'bg-cyan-600 dark:bg-cyan-500',
    'bg-emerald-600 dark:bg-emerald-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ProjectTeam({ project, members }: ProjectTeamProps) {
  const [removeProjectMember] = useRemoveProjectMemberMutation();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    memberId: number | null;
    memberName: string;
  }>({
    open: false,
    memberId: null,
    memberName: '',
  });

  const handleRemoveMember = async (memberId: number, memberName: string) => {
    setDeleteDialog({ open: true, memberId, memberName });
  };

  const confirmRemoveMember = async () => {
    if (!deleteDialog.memberId) return;

    try {
      await removeProjectMember({
        projectId: String(project.id),
        memberId: String(deleteDialog.memberId),
      }).unwrap();
      toast.success('Member removed successfully');
      setDeleteDialog({ open: false, memberId: null, memberName: '' });
    } catch {
      toast.error('Failed to remove member');
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, memberId: null, memberName: '' });
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Team Members</h2>
        </div>
        <Badge variant="secondary">{members.length + (project.manager ? 1 : 0)} total</Badge>
      </div>

      <div className="space-y-4">
        {/* Project Manager */}
        {project.manager && (
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:border-primary/50 hover:bg-accent/50 dark:hover:bg-accent/20 transition-all">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className={getUserAvatarColor(project.manager.name)}>
                <span className="text-sm font-semibold text-white">
                  {getUserInitials(project.manager.name)}
                </span>
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate text-foreground">{project.manager.name}</p>
              <p className="text-xs text-muted-foreground truncate">{project.manager.email || 'Project Manager'}</p>
            </div>
            <Badge className=" text-white  shrink-0 dark:bg-amber-700/80 dark:hover:bg-amber-700 border-amber-600 dark:border-amber-600">
              <UserIcon className="h-3 w-3 mr-1" />
              Manager
            </Badge>
          </div>
        )}

        {/* Team Members - 2 per row */}
        {members.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="group flex items-center gap-2 p-3 rounded-lg border bg-card hover:border-primary/50 hover:bg-accent/50 dark:hover:bg-accent/20 transition-all"
              >
                {member.user?.name ? (
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className={getUserAvatarColor(member.user.name)}>
                      <span className="text-xs font-semibold text-white">
                        {getUserInitials(member.user.name)}
                      </span>
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-9 w-9 rounded-lg bg-muted dark:bg-muted/60 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/70" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate text-foreground">
                    {member.user?.name || member.department?.name || 'Unknown'}
                  </p>
                  {member.department && (
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      {member.department.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="secondary" className="capitalize text-xs bg-muted dark:bg-muted/70 text-foreground dark:text-foreground hover:bg-muted/80">
                    {member.role || 'Member'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                    onClick={() => handleRemoveMember(member.id, member.user?.name || member.department?.name || 'Unknown')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {members.length === 0 && !project.manager && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted dark:bg-muted/40 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/70">No team members assigned yet</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmRemoveMember}
        title="Remove Team Member"
        description={`Are you sure you want to remove "${deleteDialog.memberName}" from this project? This action cannot be undone.`}
        confirmText="Remove Member"
        cancelText="Cancel"
        variant="danger"
        isLoading={false}
      />
    </div>
  );
}
