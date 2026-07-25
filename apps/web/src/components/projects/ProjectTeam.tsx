import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRemoveProjectMemberMutation } from '@/store/api';
import { Building2, User as UserIcon, Users, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-emerald-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ProjectTeam({ project, members }: ProjectTeamProps) {
  const [removeProjectMember] = useRemoveProjectMemberMutation();

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('Remove this team member from the project?')) return;

    try {
      await removeProjectMember({
        projectId: String(project.id),
        memberId: String(memberId),
      }).unwrap();
      toast.success('Member removed successfully');
    } catch {
      toast.error('Failed to remove member');
    }
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
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className={getUserAvatarColor(project.manager.name)}>
                <span className="text-sm font-semibold text-white">
                  {getUserInitials(project.manager.name)}
                </span>
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{project.manager.name}</p>
              <p className="text-xs text-muted-foreground truncate">{project.manager.email || 'Project Manager'}</p>
            </div>
            <Badge className="bg-amber-500 text-white hover:bg-amber-600 shrink-0">
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
                className="group flex items-center gap-2 p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-all"
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
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {member.user?.name || member.department?.name || 'Unknown'}
                  </p>
                  {member.department && (
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      {member.department.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="outline" className="capitalize text-xs">
                    {member.role || 'Member'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveMember(member.id)}
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
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No team members assigned yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
