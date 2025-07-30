import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Edit2, X, Save } from 'lucide-react';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import type { RootState } from '../../app/store';
import {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
} from '../../features/api/userApi';
import { setCredentials } from '../../features/auth/authSlice';
import type { User } from '../../types/types';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  contactPhone?: string;
  address?: string;
}

const cloud_name = 'dtuiikffe';
const preset_key = 'profile_pics';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { data: profile, isLoading, isError } = useGetCurrentUserQuery(undefined, { skip: !token });
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (profile) {
      reset({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        contactPhone: profile.contactPhone ?? '',
        address: profile.address ?? '',
      });

      dispatch(setCredentials({
        user: profile,
        token: token || '',
        userRole: profile.role,
      }));
    }
  }, [profile, dispatch, token, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!profile) return;

    try {
      const payload = {
        user_id: profile.userId,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        contactPhone: data.contactPhone,
        address: data.address,
      };

      const response = await updateUserProfile(payload).unwrap();
      dispatch(setCredentials({
        user: response as User,
        token: token || '',
        userRole: (response as User).role,
      }));

      Swal.fire('Success', 'Profile updated successfully', 'success');
      setIsModalOpen(false);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to update profile';
      Swal.fire('Error', errMsg, 'error');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    const cloudFormData = new FormData();
    cloudFormData.append('file', file);
    cloudFormData.append('upload_preset', preset_key);
    cloudFormData.append('public_id', `profile_pics/${profile.userId}`);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        cloudFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(percent);
          },
        }
      );

      const url = `${response.data.secure_url}?t=${Date.now()}`;

      if (url) {
        await updateUserProfile({ user_id: profile.userId, profileUrl: url }).unwrap();
        Swal.fire('Success', 'Profile picture updated!', 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  const avatarUrl = profile?.profileUrl || `https://res.cloudinary.com/${cloud_name}/image/upload/v1/profile_pics/${profile?.userId}.jpg`;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.firstname || 'User')}&background=7e22ce&color=fff&size=128`;

  if (isLoading) return <p className="text-center py-6">Loading profile…</p>;
  if (isError || !profile) return <p className="text-center py-6 text-red-500">Failed to load profile.</p>;
return (
  <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
    {/* Profile Header */}
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
      {/* Avatar */}
      <div className="relative">
        <img
          src={avatarUrl}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackAvatar;
          }}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
        />
        <label
          htmlFor="profile-upload"
          className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition"
        >
          <FaCamera className="text-white" />
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          aria-label="Upload profile picture"
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute top-full mt-1 text-xs text-gray-700">{uploadProgress}%</div>
        )}
      </div>

      {/* User Info */}
      <div className="text-center sm:text-left flex-1">
        <h2 className="text-2xl font-bold text-purple-700">
          {profile.firstname} {profile.lastname}
        </h2>
        <p className="text-gray-500 break-words">{profile.email}</p>
      </div>

      {/* Edit Button */}
      <div className="sm:ml-auto mt-4 sm:mt-0">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-outline btn-sm text-purple-700 hover:bg-purple-100 flex items-center gap-2"
        >
          <Edit2 size={16} /> Edit
        </button>
      </div>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
      <div>
        <p className="font-semibold">Phone</p>
        <p>{profile.contactPhone || 'N/A'}</p>
      </div>
      <div>
        <p className="font-semibold">Role</p>
        <p className="capitalize">{profile.role}</p>
      </div>
      <div>
        <p className="font-semibold">Address</p>
        <p>{profile.address || 'N/A'}</p>
      </div>
      <div>
        <p className="font-semibold">Joined</p>
        <p>{new Date(profile.createdAt ?? '').toLocaleDateString()}</p>
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="modal modal-open bg-black bg-opacity-50">
        <div className="modal-box relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
            title="Close"
          >
            <X size={12} />
          </button>
          <h3 className="text-lg font-semibold mb-4 text-purple-700">Edit Profile</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                {...register('firstname', { required: 'First name is required' })}
                className="input input-bordered w-full"
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm">{errors.firstname.message}</p>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                {...register('lastname', { required: 'Last name is required' })}
                className="input input-bordered w-full"
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm">{errors.lastname.message}</p>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: 'Invalid email format',
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input type="tel" {...register('contactPhone')} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                {...register('address')}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>
            <div className="modal-action">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isUpdating}
              >
                <Save size={16} /> {isUpdating ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default UserProfile;
