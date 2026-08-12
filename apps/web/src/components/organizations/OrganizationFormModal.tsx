import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ImageIcon, Upload, X } from 'lucide-react';
import { z } from 'zod';
import {
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useUploadOrganizationLogoMutation,
  useUploadOrganizationDarkLogoMutation,
  useUploadOrganizationLightLogoMutation,
} from '../../store/api/index';

const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

const editOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type OrganizationFormData = z.infer<typeof createOrganizationSchema>;
type EditOrganizationFormData = z.infer<typeof editOrganizationSchema>;

interface OrganizationFormModalProps {
  open: boolean;
  onClose: () => void;
  editingOrganization: any | null;
}

export default function OrganizationFormModal({
  open,
  onClose,
  editingOrganization,
}: OrganizationFormModalProps) {
  const [createOrganization] = useCreateOrganizationMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();
  const [uploadLogo] = useUploadOrganizationLogoMutation();
  const [uploadDarkLogo] = useUploadOrganizationDarkLogoMutation();
  const [uploadLightLogo] = useUploadOrganizationLightLogoMutation();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [darkLogoFile, setDarkLogoFile] = useState<File | null>(null);
  const [darkLogoPreview, setDarkLogoPreview] = useState<string>('');
  const [lightLogoFile, setLightLogoFile] = useState<File | null>(null);
  const [lightLogoPreview, setLightLogoPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<EditOrganizationFormData>({
    resolver: zodResolver(editOrganizationSchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  useEffect(() => {
    if (editingOrganization) {
      reset({
        name: editingOrganization.name || '',
        description: editingOrganization.description || '',
        website: editingOrganization.website || '',
        address: editingOrganization.address || '',
        phone: editingOrganization.phone || '',
        email: editingOrganization.email || '',
      });
      // Set logo previews if exist
      setLogoPreview(editingOrganization.logo_url || '');
      setDarkLogoPreview(editingOrganization.dark_logo_url || '');
      setLightLogoPreview(editingOrganization.light_logo_url || '');
      setLogoFile(null);
      setDarkLogoFile(null);
      setLightLogoFile(null);
    } else {
      reset({
        name: '',
        description: '',
        website: '',
        address: '',
        phone: '',
        email: '',
      });
      setLogoPreview('');
      setDarkLogoPreview('');
      setLightLogoPreview('');
      setLogoFile(null);
      setDarkLogoFile(null);
      setLightLogoFile(null);
    }
  }, [editingOrganization, reset, open]);

  const onSubmit = async (data: EditOrganizationFormData) => {
    try {
      if (editingOrganization) {
        // Update organization
        await updateOrganization({
          id: editingOrganization.id,
          ...data,
        }).unwrap();

        // Upload logos if new files are selected
        if (logoFile) {
          await uploadLogo({
            id: editingOrganization.id,
            file: logoFile,
          }).unwrap();
        }
        if (darkLogoFile) {
          await uploadDarkLogo({
            id: editingOrganization.id,
            file: darkLogoFile,
          }).unwrap();
        }
        if (lightLogoFile) {
          await uploadLightLogo({
            id: editingOrganization.id,
            file: lightLogoFile,
          }).unwrap();
        }

        toast.success('Organization updated successfully!');
      } else {
        // Create organization first
        const result = await createOrganization(data as OrganizationFormData).unwrap();

        // Upload logos if files were selected and organization was created successfully
        const logoPromises = [];
        if (logoFile && result?.id) {
          logoPromises.push(uploadLogo({ id: result.id, file: logoFile }).unwrap());
        }
        if (darkLogoFile && result?.id) {
          logoPromises.push(uploadDarkLogo({ id: result.id, file: darkLogoFile }).unwrap());
        }
        if (lightLogoFile && result?.id) {
          logoPromises.push(uploadLightLogo({ id: result.id, file: lightLogoFile }).unwrap());
        }

        if (logoPromises.length > 0) {
          try {
            await Promise.all(logoPromises);
            toast.success('Organization created with logos!');
          } catch (logoError) {
            console.error('Logo upload failed:', logoError);
            toast.success('Organization created, but some logos may have failed to upload');
          }
        } else {
          toast.success('Organization created successfully!');
        }
      }
      reset();
      setLogoFile(null);
      setLogoPreview('');
      setDarkLogoFile(null);
      setDarkLogoPreview('');
      setLightLogoFile(null);
      setLightLogoPreview('');
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || `Failed to ${editingOrganization ? 'update' : 'create'} organization`;
      toast.error(errorMessage);
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDarkLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setDarkLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setDarkLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLightLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLightLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLightLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingOrganization ? 'Edit Organization' : 'Create New Organization'}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {isSubmitting
              ? 'Saving...'
              : editingOrganization
                ? 'Update'
                : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Organization Name <span className="text-destructive">*</span>
          </Label>
          <Input
            {...register('name')}
            id="name"
            placeholder="Enter organization name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        {/* Logo Upload Section - Show for both create and edit */}
        <div className="space-y-2">
          <Label>Organization Logo</Label>
          <div className="flex items-center gap-4">
            {/* Logo Preview */}
            <div className="relative shrink-0">
              {logoPreview ? (
                <div className="relative group">
                  <img
                    src={logoPreview}
                    alt="Organization logo"
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview('');
                      setLogoFile(null);
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-2">
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <div className="flex gap-2 flex-wrap">
                <label
                  htmlFor="logo"
                  className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {logoFile ? logoFile.name : 'Choose File'}
                </label>
                {logoPreview && !editingOrganization && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    Logo will be uploaded after creating the organization
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, max 5MB (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        </div>

        {/* Dark Logo Upload Section */}
        <div className="space-y-2">
          <Label>Dark Logo (for dark theme)</Label>
          <div className="flex items-center gap-4">
            {/* Dark Logo Preview */}
            <div className="relative shrink-0">
              {darkLogoPreview ? (
                <div className="relative group">
                  <img
                    src={darkLogoPreview}
                    alt="Organization dark logo"
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDarkLogoPreview('');
                      setDarkLogoFile(null);
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-2">
              <input
                type="file"
                id="dark-logo"
                accept="image/*"
                onChange={handleDarkLogoChange}
                className="hidden"
              />
              <div className="flex gap-2 flex-wrap">
                <label
                  htmlFor="dark-logo"
                  className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {darkLogoFile ? darkLogoFile.name : 'Choose File'}
                </label>
                {darkLogoPreview && !editingOrganization && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    Dark logo will be uploaded after creating the organization
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: Light-colored logo for dark backgrounds, max 5MB (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        </div>

        {/* Light Logo Upload Section */}
        <div className="space-y-2">
          <Label>Light Logo (for light theme)</Label>
          <div className="flex items-center gap-4">
            {/* Light Logo Preview */}
            <div className="relative shrink-0">
              {lightLogoPreview ? (
                <div className="relative group">
                  <img
                    src={lightLogoPreview}
                    alt="Organization light logo"
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLightLogoPreview('');
                      setLightLogoFile(null);
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-2">
              <input
                type="file"
                id="light-logo"
                accept="image/*"
                onChange={handleLightLogoChange}
                className="hidden"
              />
              <div className="flex gap-2 flex-wrap">
                <label
                  htmlFor="light-logo"
                  className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {lightLogoFile ? lightLogoFile.name : 'Choose File'}
                </label>
                {lightLogoPreview && !editingOrganization && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    Light logo will be uploaded after creating the organization
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: Dark-colored logo for light backgrounds, max 5MB (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register('description')}
            id="description"
            placeholder="Enter organization description"
            rows={3}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder="contact@organization.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            {...register('phone')}
            id="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            {...register('website')}
            id="website"
            type="url"
            placeholder="https://www.example.com"
            className={errors.website ? 'border-destructive' : ''}
          />
          {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            {...register('address')}
            id="address"
            placeholder="Enter organization address"
            rows={2}
            className={errors.address ? 'border-destructive' : ''}
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>

        {errors.root && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{errors.root.message}</p>
          </div>
        )}
      </form>
    </Modal>
  );
}
