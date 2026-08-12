import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Clock, CheckSquare } from 'lucide-react';
import toast from 'react-toastify';
import {
  useUpdateNotificationPreferenceMutation,
  useGetNotificationPreferencesQuery,
} from '@/store/api';

interface NotificationGroup {
  title: string;
  description: string;
  icon: any;
  preferences: {
    type: string;
    label: string;
    description: string;
    hasReminder?: boolean;
  }[];
}

const notificationGroups: NotificationGroup[] = [
  {
    title: 'Task Notifications',
    description: 'Stay updated about your tasks',
    icon: CheckSquare,
    preferences: [
      { type: 'task_assigned', label: 'New Task Assigned', description: 'When someone assigns you a task' },
      { type: 'task_updated', label: 'Task Updated', description: 'When a task is modified' },
      { type: 'task_comment', label: 'New Comments', description: 'When someone comments on your task' },
      { type: 'task_due_soon', label: 'Due Soon Reminder', description: 'Remind me before task is due', hasReminder: true },
      { type: 'task_overdue', label: 'Overdue Alert', description: 'When a task is past due' },
      { type: 'task_completed', label: 'Task Completed', description: 'When a task is marked complete' },
    ],
  },
  {
    title: 'Project Notifications',
    description: 'Updates about your projects',
    icon: Bell,
    preferences: [
      { type: 'project_created', label: 'New Project', description: 'When a new project is created' },
      { type: 'project_updated', label: 'Project Updated', description: 'When project details change' },
    ],
  },
  {
    title: 'Milestone Notifications',
    description: 'Track your project milestones',
    icon: Clock,
    preferences: [
      { type: 'milestone_completed', label: 'Milestone Completed', description: 'When a milestone is achieved' },
      { type: 'milestone_due_soon', label: 'Due Soon Reminder', description: 'Remind me before milestone is due', hasReminder: true },
    ],
  },
];

export default function NotificationSettings() {
  const { data: preferences, isLoading } = useGetNotificationPreferencesQuery();
  const [updatePreference] = useUpdateNotificationPreferenceMutation();

  const handleToggle = async (type: string, field: 'email' | 'inApp', value: boolean) => {
    try {
      await updatePreference({
        type: type as any,
        [`${field}_enabled`]: value,
      }).unwrap();

      toast.success('Notification preference updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update preference');
    }
  };

  const handleReminderHoursChange = async (type: string, hours: number) => {
    try {
      await updatePreference({
        type: type as any,
        reminder_hours: hours,
      }).unwrap();

      toast.success('Reminder time updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update reminder time');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardContent className="p-8 sm:p-12">
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Notification Settings</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">Manage how you receive notifications</p>
        </div>
      </div>

      {notificationGroups.map((group) => {
        const Icon = group.icon;
        return (
          <Card key={group.title}>
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">{group.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{group.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-3 sm:pt-6 space-y-4 sm:space-y-6">
              {group.preferences.map((pref) => {
                const setting = preferences?.find((p) => p.notification_type === pref.type);
                return (
                  <div key={pref.type} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 border-b last:border-0 pb-4 sm:pb-6 last:pb-0 last:pb-0">
                    <div className="space-y-1 sm:space-y-1 min-w-0 flex-1">
                      <Label className="text-sm sm:text-base font-medium">{pref.label}</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">{pref.description}</p>
                      {pref.hasReminder && setting && (
                        <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <select
                            value={setting.reminder_hours || 24}
                            onChange={(e) => handleReminderHoursChange(pref.type, Number(e.target.value))}
                            className="h-8 sm:h-8 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value={1}>1 hour before</option>
                            <option value={6}>6 hours before</option>
                            <option value={12}>12 hours before</option>
                            <option value={24}>1 day before</option>
                            <option value={48}>2 days before</option>
                            <option value={72}>3 days before</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Switch
                          checked={setting?.email_enabled ?? true}
                          onCheckedChange={(checked) => handleToggle(pref.type, 'email', checked)}
                        />
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm hidden xs:inline">Email</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Switch
                          checked={setting?.in_app_enabled ?? true}
                          onCheckedChange={(checked) => handleToggle(pref.type, 'inApp', checked)}
                        />
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm hidden xs:inline">In App</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
