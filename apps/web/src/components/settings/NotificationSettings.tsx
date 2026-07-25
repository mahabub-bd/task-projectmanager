import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Clock, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
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
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notification Settings</h2>
          <p className="text-muted-foreground">Manage how you receive notifications</p>
        </div>
      </div>

      {notificationGroups.map((group) => {
        const Icon = group.icon;
        return (
          <Card key={group.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {group.preferences.map((pref) => {
                const setting = preferences?.find((p) => p.notification_type === pref.type);
                return (
                  <div key={pref.type} className="flex items-start justify-between border-b last:border-0 pb-6 last:pb-0">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">{pref.label}</Label>
                      <p className="text-sm text-muted-foreground">{pref.description}</p>
                      {pref.hasReminder && setting && (
                        <div className="mt-3 flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <select
                            value={setting.reminder_hours || 24}
                            onChange={(e) => handleReminderHoursChange(pref.type, Number(e.target.value))}
                            className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={setting?.email_enabled ?? true}
                          onCheckedChange={(checked) => handleToggle(pref.type, 'email', checked)}
                        />
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Email</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={setting?.in_app_enabled ?? true}
                          onCheckedChange={(checked) => handleToggle(pref.type, 'inApp', checked)}
                        />
                        <div className="flex items-center gap-1.5">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">In App</span>
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
