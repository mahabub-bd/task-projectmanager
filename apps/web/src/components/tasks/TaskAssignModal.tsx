import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/store/store';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAssignUsersToTaskMutation, useGetDepartmentsListQuery, useGetUsersByDepartmentQuery } from '../../store/api';

interface TaskAssignModalProps {
  open: boolean;
  onClose: () => void;
  taskId: string | null;
  taskTitle: string;
  currentAssignments?: number[];
}

export default function TaskAssignModal({ open, onClose, taskId, taskTitle, currentAssignments = [] }: TaskAssignModalProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(currentAssignments);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [notes, setNotes] = useState('');

  const { user } = useAppSelector((state) => state.auth);
  const organizationId = user?.organization_id || Number(localStorage.getItem('organization_id'));

  const { data: departmentsData } = useGetDepartmentsListQuery(organizationId ? String(organizationId) : undefined);
  const { data: usersData } = useGetUsersByDepartmentQuery(selectedDepartmentId, {
    skip: !selectedDepartmentId,
  });
  const [assignUsers] = useAssignUsersToTaskMutation();

  const departments = Array.isArray(departmentsData) ? departmentsData : [];
  const users = Array.isArray(usersData) ? usersData : [];

  // Reset selected users when department changes
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartmentId(value);
    setSelectedUserIds([]);
  };

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    if (!taskId || selectedUserIds.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      await assignUsers({
        taskId,
        userIds: selectedUserIds,
        notes: notes.trim() || undefined,
      }).unwrap();
      toast.success('Users assigned successfully');
      onClose();
    } catch {
      toast.error('Failed to assign users');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Assign Users to "${taskTitle}"`}
      description={taskTitle}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={selectedUserIds.length === 0}>
            Assign {selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Department Selection */}
        <div>
          <label htmlFor="department" className="text-sm font-medium mb-2 block">Select Department</label>
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
            <p className="text-xs text-muted-foreground mt-2">
              {users.length} user{users.length !== 1 ? 's' : ''} in this department
            </p>
          )}
        </div>

        {/* User Selection */}
        {selectedDepartmentId && (
          <div>
            <label className="text-sm font-medium mb-2 block">Select Users</label>
            <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-1 bg-muted/20">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No users available in this department</p>
              ) : (
                users.map((user: any) => {
                const isSelected = selectedUserIds.includes(user.id);
                const isAssigned = currentAssignments.includes(user.id);
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-accent' : ''
                      }`}
                  >
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleUser(user.id)} />
                    <div className="flex-1 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    {isAssigned && !isSelected && (
                      <span className="text-xs text-muted-foreground">(currently assigned)</span>
                    )}
                  </label>
                );
              })
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
          </p>
          </div>
        )}

        {/* Assignment Notes */}
        <div>
          <label htmlFor="notes" className="text-sm font-medium mb-2 block">
            Assignment Notes <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes or instructions for the assignee(s)..."
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}
