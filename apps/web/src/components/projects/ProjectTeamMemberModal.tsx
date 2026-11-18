import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/store';
import { useState } from 'react';
import { toastSuccess, toastError } from '@/lib/toast';
import { useAddProjectMemberMutation, useGetDepartmentsListQuery, useGetUsersByDepartmentQuery } from '../../store/api';

interface ProjectTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
  projectName: string;
  currentMemberIds?: number[];
}

const roleOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
];

export default function ProjectTeamMemberModal({
  open,
  onClose,
  projectId,
  projectName,
  currentMemberIds = [],
}: ProjectTeamMemberModalProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('member');
  const [notes, setNotes] = useState('');

  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id || Number(localStorage.getItem('organization_id'));

  const { data: departmentsData } = useGetDepartmentsListQuery(organizationId ? String(organizationId) : undefined);
  const { data: usersData } = useGetUsersByDepartmentQuery(selectedDepartmentId, {
    skip: !selectedDepartmentId,
  });
  const [addMember] = useAddProjectMemberMutation();

  const departments = Array.isArray(departmentsData) ? departmentsData : [];
  const users = Array.isArray(usersData) ? usersData : [];

  // Change department - keep selected users
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartmentId(value);
  };

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    if (!projectId || selectedUserIds.length === 0) {
      toastError('Please select at least one user');
      return;
    }

    try {
      // Add each selected user as a member
      for (const userId of selectedUserIds) {
        await addMember({
          projectId,
          user_id: userId,
          role: selectedRole as any,
          notes: notes.trim() || undefined,
        }).unwrap();
      }
      toastSuccess(`${selectedUserIds.length} member(s) added successfully`);
      onClose();
      // Reset form
      setSelectedUserIds([]);
      setSelectedDepartmentId('');
      setSelectedRole('member');
      setNotes('');
    } catch {
      toastError('Failed to add member(s)');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setSelectedUserIds([]);
    setSelectedDepartmentId('');
    setSelectedRole('member');
    setNotes('');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="2xl"
      title={`Add Team Members to "${projectName}"`}
      description={projectName}
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={selectedUserIds.length === 0}>
            Add {selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Department Selection */}
        <div>
          <label htmlFor="department" className="text-sm font-medium mb-2 block text-foreground">Select Department</label>
          <Select value={selectedDepartmentId} onValueChange={handleDepartmentChange}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Choose a department..." />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept: any) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDepartmentId && (
            <p className="text-xs text-muted-foreground dark:text-muted-foreground/70 mt-2">
              {users.length} user{users.length !== 1 ? 's' : ''} in this department
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="text-sm font-medium mb-2 block text-foreground">Member Role</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role..." />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Selection */}
        {selectedDepartmentId && (
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Select Users</label>
            <div className="border dark:border-border rounded-md p-3 max-h-64 overflow-y-auto space-y-1 bg-muted/30 dark:bg-muted/10">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground dark:text-muted-foreground/70 text-center py-4">No users available in this department</p>
              ) : (
                users.map((user: any) => {
                const isSelected = selectedUserIds.includes(user.id);
                const isMember = currentMemberIds.includes(user.id);
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-2 hover:bg-accent dark:hover:bg-accent/30 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-accent dark:bg-accent/40' : ''
                      }`}
                  >
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleUser(user.id)} />
                    <div className="flex-1 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                        {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    {isMember && !isSelected && (
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground/70">(already member)</span>
                    )}
                  </label>
                );
              })
            )}
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground/70 mt-2">
              {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Assignment Notes */}
        <div>
          <label htmlFor="notes" className="text-sm font-medium mb-2 block text-foreground">
            Notes <span className="text-muted-foreground dark:text-muted-foreground/70 font-normal">(optional)</span>
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the member assignment..."
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}
