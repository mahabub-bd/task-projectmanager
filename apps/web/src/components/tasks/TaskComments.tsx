import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGetUsersListQuery, useLikeTaskCommentMutation, useUnlikeTaskCommentMutation } from '@/store/api';
import { format } from 'date-fns';
import { AlertTriangle, Send, ThumbsUp, AtSign } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const safeFormatDate = (dateValue: string | Date | null | undefined, formatStr: string = 'MMM d, yyyy') => {
  if (!dateValue) return 'N/A';
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return 'N/A';
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
};

interface TaskCommentsProps {
  task: any;
  user: any;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  editingComment: { id: number; content: string } | null;
  setEditingComment: React.Dispatch<React.SetStateAction<{ id: number; content: string } | null>>;
  onCreateComment: (mentions?: number[]) => void;
  onUpdateComment: () => void;
  onDeleteComment: (commentId: number) => void;
  canEditOrDelete: (comment: any) => boolean;
  onRefetchTask?: () => void;
  onRefetchComments?: () => void;
}

export default function TaskComments({
  task,
  user,
  newComment,
  setNewComment,
  editingComment,
  setEditingComment,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  canEditOrDelete,
  onRefetchTask,
  onRefetchComments,
}: TaskCommentsProps) {
  const [likeComment] = useLikeTaskCommentMutation();
  const [unlikeComment] = useUnlikeTaskCommentMutation();
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionPickerRef = useRef<HTMLDivElement>(null);

  const organizationId = user?.organization_id;
  const { data: usersData } = useGetUsersListQuery(organizationId ? String(organizationId) : undefined);
  const users = usersData?.data || [];

  // Filter users based on mention query
  const filteredUsers = users.filter((u: any) =>
    u.name?.toLowerCase().includes(mentionQuery.toLowerCase()) &&
    u.id !== user?.id
  );

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    const textarea = textareaRef.current;
    if (!textarea) return;

    const position = textarea.selectionStart;

    // Find the @ symbol before cursor
    const textBeforeCursor = value.substring(0, position);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      // Check if there's a space after @
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ') && textAfterAt.length < 30) {
        setMentionQuery(textAfterAt);
        setCursorPosition(position);
        setShowMentionPicker(true);
        setSelectedUserIndex(0);
        return;
      }
    }

    setShowMentionPicker(false);
  };

  // Close mention picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mentionPickerRef.current && !mentionPickerRef.current.contains(event.target as Node)) {
        setShowMentionPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const insertMention = (selectedUser: any) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const value = textarea.value;
    const position = cursorPosition;

    // Find the @ symbol position
    const textBeforeCursor = value.substring(0, position);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    // Replace @query with @[user_id](user_name) for backend parsing
    const beforeMention = value.substring(0, lastAtIndex);
    const afterMention = value.substring(position);
    const mentionText = `@[${selectedUser.id}](${selectedUser.name}) `;

    const newValue = beforeMention + mentionText + afterMention;
    setNewComment(newValue);

    // Set cursor position after the mention
    setTimeout(() => {
      const newPosition = lastAtIndex + mentionText.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);

    setShowMentionPicker(false);
  };

  const renderCommentWithMentions = (content: string) => {
    // Regex to match @[user_id](user_name)
    const mentionRegex = /@\[(\d+)\]\(([^)]+)\)/g;

    const parts = content.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 3 === 1) {
        // This is user_id
        return null;
      } else if (index % 3 === 2) {
        // This is user_name
        return (
          <span key={index} className="text-primary font-medium">
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  const extractMentions = (content: string): number[] => {
    const mentionRegex = /@\[(\d+)\]\(([^)]+)\)/g;
    const mentions: number[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const userId = parseInt(match[1], 10);
      if (!isNaN(userId)) {
        mentions.push(userId);
      }
    }

    return mentions;
  };

  const getCommentText = (comment: any) => comment.content || comment.comment || '';

  const handleLikeComment = async (commentId: number) => {
    try {
      await likeComment({ taskId: task.id, commentId: String(commentId) }).unwrap();
      toast.success('Comment liked!');
      onRefetchComments?.();
      onRefetchTask?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to like comment');
    }
  };

  const handleUnlikeComment = async (commentId: number) => {
    try {
      await unlikeComment({ taskId: task.id, commentId: String(commentId) }).unwrap();
      toast.success('Comment unliked!');
      onRefetchComments?.();
      onRefetchTask?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to unlike comment');
    }
  };

  const checkIfLiked = (comment: any) => {
    if (!comment.likes || !Array.isArray(comment.likes)) return false;
    return comment.likes.some((like: any) => like.user_id === user?.id);
  };

  const getLikeCount = (comment: any) => {
    return comment.likes?.length || 0;
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Comments ({task.comment_count || 0})</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {task.comments && Array.isArray(task.comments) && task.comments.length > 0 ? (
          task.comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {comment.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                {editingComment?.id === comment.id ? (
                  // Edit mode
                  <div className="bg-muted/30 rounded-2xl px-4 py-2">
                    <Textarea
                      value={editingComment?.content || ''}
                      onChange={(e) => {
                        if (editingComment) {
                          setEditingComment({ id: editingComment.id, content: e.target.value });
                        }
                      }}
                      placeholder="Edit your comment..."
                      rows={2}
                      className="text-sm border-0 bg-transparent p-0 focus-visible:ring-0 resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setEditingComment(null)}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" className="h-7 text-xs" onClick={onUpdateComment}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="bg-muted/30 rounded-2xl px-4 py-2">
                      {/* Name and Time */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.user?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          • {safeFormatDate(comment.created_at, 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                      {/* Comment Text */}
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {renderCommentWithMentions(getCommentText(comment))}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-1 px-2">
                      <button
                        onClick={() => {
                          if (checkIfLiked(comment)) {
                            handleUnlikeComment(comment.id);
                          } else {
                            handleLikeComment(comment.id);
                          }
                        }}
                        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all ${
                          checkIfLiked(comment)
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        <ThumbsUp className={`h-3 w-3 ${checkIfLiked(comment) ? 'fill-current' : ''}`} />
                        <span>{getLikeCount(comment) > 0 ? getLikeCount(comment) : 'Like'}</span>
                      </button>

                      {/* Show who liked */}
                      {getLikeCount(comment) > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {checkIfLiked(comment) && 'You'}
                          {!checkIfLiked(comment) && comment.likes?.length === 1 && `${comment.likes[0]?.user?.name || 'Someone'}`}
                          {!checkIfLiked(comment) && comment.likes?.length > 1 && `${comment.likes?.length} people`}
                          {checkIfLiked(comment) && comment.likes?.length > 1 && ` + ${comment.likes?.length - 1} ${comment.likes?.length - 1 === 1 ? 'other' : 'others'}`}
                          {getLikeCount(comment) === 1 && ' liked this'}
                          {getLikeCount(comment) > 1 && ' liked this'}
                        </span>
                      )}

                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Reply
                      </button>
                      {canEditOrDelete(comment) && (
                        <>
                          <button
                            onClick={() => setEditingComment({ id: comment.id, content: getCommentText(comment) })}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCommentToDelete(comment.id);
                              setDeleteConfirmOpen(true);
                            }}
                            className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Add New Comment */}
      <div className="border-t pt-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          {/* Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Write a comment... Use @ to mention users"
                rows={2}
                className="pr-12 resize-none rounded-2xl"
                onKeyDown={(e) => {
                  if (showMentionPicker) {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSelectedUserIndex((prev) =>
                        prev < filteredUsers.length - 1 ? prev + 1 : prev
                      );
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSelectedUserIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (filteredUsers[selectedUserIndex]) {
                        insertMention(filteredUsers[selectedUserIndex]);
                      }
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setShowMentionPicker(false);
                    }
                  } else if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onCreateComment();
                  }
                }}
              />
              {newComment.trim() && (
                <Button
                  size="sm"
                  onClick={() => onCreateComment(extractMentions(newComment))}
                  className="absolute right-2 bottom-2 h-7 w-7 p-0 rounded-full"
                >
                  <Send className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Mention Picker */}
            {showMentionPicker && filteredUsers.length > 0 && (
              <div
                ref={mentionPickerRef}
                className="absolute bottom-full left-0 mb-2 w-64 bg-card border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10"
              >
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-2 py-1">
                    <AtSign className="h-3 w-3 inline mr-1" />
                    Mentioning users
                  </p>
                  {filteredUsers.slice(0, 5).map((u: any, index: number) => (
                    <button
                      key={u.id}
                      onClick={() => insertMention(u)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left ${
                        index === selectedUserIndex ? 'bg-accent' : 'hover:bg-accent'
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {u.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-sm text-muted-foreground px-2 py-2">No users found</p>
                  )}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-1 px-2">
              Press Enter to send, Shift + Enter for new line • Type @ to mention users
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete Comment</DialogTitle>
              </div>
            </div>
            <DialogDescription className="pt-4">
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setCommentToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (commentToDelete) {
                  onDeleteComment(commentToDelete);
                  setDeleteConfirmOpen(false);
                  setCommentToDelete(null);
                }
              }}
            >
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
