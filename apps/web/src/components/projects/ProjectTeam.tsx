import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRemoveProjectMemberMutation } from '@/store/api';
import { Building2, User as UserIcon, Users, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProjectTeamProps {
  project: any;
  members: any[];
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Team Members</h2>
        </div>
        <Badge variant="secondary">{members.length + (project.manager ? 1 : 0)} total</Badge>
      </div>

      <div className="space-y-4">
        {/* Project Manager */}
        {project.manager && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-amber-500">
                <span className="text-sm font-semibold text-white">
                  {getInitials(project.manager.name)}
                </span>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{project.manager.name}</p>
                <p className="text-xs text-muted-foreground">{project.manager.email || 'Project Manager'}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              <UserIcon className="h-3 w-3 mr-1" />
              Manager
            </Badge>
          </div>
        )}

        {/* Team Members */}
        {members.length > 0 && (
          <div className="space-y-2">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {member.user?.name ? (
                    <Avatar className={`h-10 w-10 ${getAvatarColor(member.user.name)}`}>
                      <span className="text-sm font-semibold text-white">
                        {getInitials(member.user.name)}
                      </span>
                    </Avatar>
                  ) : member.department && (
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {member.user?.name || member.department?.name || 'Unknown'}
                    </p>
                    {member.department && (
                      <p className="text-xs text-muted-foreground">{member.department.name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize text-xs">
                    {member.role || 'Member'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {members.length === 0 && !project.manager && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No team members assigned yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
