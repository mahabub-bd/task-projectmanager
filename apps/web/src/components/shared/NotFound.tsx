import { Button } from '@/components/ui/button';
import { FileText, FolderKanban, Flag, Building2, Briefcase, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type EntityType =
  | 'task'
  | 'tasks'
  | 'project'
  | 'projects'
  | 'milestone'
  | 'milestones'
  | 'organization'
  | 'organizations'
  | 'department'
  | 'departments'
  | 'division'
  | 'divisions'
  | 'designation'
  | 'designations'
  | 'role'
  | 'roles'
  | 'permission'
  | 'permissions'
  | 'user'
  | 'users';

interface NotFoundProps {
  /**
   * The type of entity that was not found
   */
  entityType?: EntityType;

  /**
   * Custom message to display instead of the default
   */
  message?: string;

  /**
   * Custom sub-message to display instead of the default
   */
  subMessage?: string;

  /**
   * Custom button text
   */
  buttonText?: string;

  /**
   * Custom button click handler
   */
  onButtonClick?: () => void;

  /**
   * Whether to show the back button
   */
  showBackButton?: boolean;

  /**
   * Custom class name for the container
   */
  className?: string;
}

// Entity type configurations
const ENTITY_CONFIG: Record<EntityType, { icon: any; singular: string; plural: string; basePath: string }> = {
  task: { icon: FileText, singular: 'Task', plural: 'Tasks', basePath: '/tasks' },
  tasks: { icon: FileText, singular: 'Task', plural: 'Tasks', basePath: '/tasks' },
  project: { icon: FolderKanban, singular: 'Project', plural: 'Projects', basePath: '/projects' },
  projects: { icon: FolderKanban, singular: 'Project', plural: 'Projects', basePath: '/projects' },
  milestone: { icon: Flag, singular: 'Milestone', plural: 'Milestones', basePath: '/milestones' },
  milestones: { icon: Flag, singular: 'Milestone', plural: 'Milestones', basePath: '/milestones' },
  organization: { icon: Building2, singular: 'Organization', plural: 'Organizations', basePath: '/organizations' },
  organizations: { icon: Building2, singular: 'Organization', plural: 'Organizations', basePath: '/organizations' },
  department: { icon: Briefcase, singular: 'Department', plural: 'Departments', basePath: '/departments' },
  departments: { icon: Briefcase, singular: 'Department', plural: 'Departments', basePath: '/departments' },
  division: { icon: ChevronRight, singular: 'Division', plural: 'Divisions', basePath: '/divisions' },
  divisions: { icon: ChevronRight, singular: 'Division', plural: 'Divisions', basePath: '/divisions' },
  designation: { icon: Users, singular: 'Designation', plural: 'Designations', basePath: '/designations' },
  designations: { icon: Users, singular: 'Designation', plural: 'Designations', basePath: '/designations' },
  role: { icon: Users, singular: 'Role', plural: 'Roles', basePath: '/roles' },
  roles: { icon: Users, singular: 'Role', plural: 'Roles', basePath: '/roles' },
  permission: { icon: Flag, singular: 'Permission', plural: 'Permissions', basePath: '/permissions' },
  permissions: { icon: Flag, singular: 'Permission', plural: 'Permissions', basePath: '/permissions' },
  user: { icon: Users, singular: 'User', plural: 'Users', basePath: '/users' },
  users: { icon: Users, singular: 'User', plural: 'Users', basePath: '/users' },
};

/**
 * A reusable "Not Found" component for detail pages
 * Displays a user-friendly error state when an entity cannot be found
 */
export function NotFound({
  entityType = 'task',
  message,
  subMessage,
  buttonText,
  onButtonClick,
  showBackButton = true,
  className,
}: NotFoundProps) {
  const navigate = useNavigate();

  const config = ENTITY_CONFIG[entityType] || ENTITY_CONFIG.task;
  const Icon = config.icon;

  const defaultMessage = `${config.singular} not found`;
  const defaultSubMessage = `The ${config.singular.toLowerCase()} you're looking for doesn't exist or you don't have access to it.`;
  const defaultButtonText = `Back to ${config.plural}`;

  const handleBackClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate(config.basePath);
    }
  };

  return (
    <div className={className || "flex items-center justify-center p-6 sm:p-12"}>
      <div className="text-center max-w-md">
        <Icon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
          {message || defaultMessage}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          {subMessage || defaultSubMessage}
        </p>
        {showBackButton && (
          <Button onClick={handleBackClick} size="sm" className="text-xs sm:text-sm">
            {buttonText || defaultButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
