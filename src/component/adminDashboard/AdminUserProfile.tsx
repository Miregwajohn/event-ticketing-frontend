import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { X, Save } from 'lucide-react';
import Swal from 'sweetalert2';
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

const AdminUserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: profile, isLoading, isError } = useGetCurrentUserQuery(undefined, { skip: !token });
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate('/login');
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

      if (profile.profileUrl) setAvatarPreview(profile.profileUrl);
    }
  }, [profile, reset, dispatch, token]);

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
        cloudFormData
      );

      const url = `${response.data.secure_url}?t=${Date.now()}`;
      setAvatarPreview(url); // Live preview

      if (url) {
        await updateUserProfile({ user_id: profile.userId, profileUrl: url }).unwrap(); // <-- FIXED
        Swal.fire('Success', 'Profile picture updated!', 'success');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  const avatarUrl =
    avatarPreview ||
    `https://res.cloudinary.com/${cloud_name}/image/upload/v1/profile_pics/${profile?.userId}.jpg`;

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.firstname || 'User')}&background=7e22ce&color=fff&size=128`;

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
      const updatedUser = response as User;

      dispatch(setCredentials({
        user: updatedUser,
        token: token || '',
        userRole: updatedUser.role,
      }));

      Swal.fire('Success', 'Profile updated successfully', 'success');
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire('Error', 'Profile update failed', 'error');
    }
  };

  if (isLoading) return <p className="text-center py-6">Loading profile…</p>;
  if (isError || !profile) return <p className="text-center py-6 text-red-500">Failed to load profile.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 px-6">
      <div className="max-w-5xl mx-auto bg-slate-800 border border-sky-500 shadow-xl p-6 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-600 pb-6 mb-6">
          <div className="relative flex items-center gap-6 mb-4 md:mb-0">
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
              htmlFor="upload-avatar"
              title="Upload profile picture"
              className="absolute bottom-0 left-20 bg-sky-500 p-2 rounded-full cursor-pointer hover:bg-sky-600 transition"
            >
              <FaCamera className="text-white" aria-hidden="true" />
            </label>

            <input
              id="upload-avatar"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              title="Upload profile picture"
              aria-label="Upload profile picture"
              accept="image/*"
            />

            <div>
              <h2 className="text-3xl font-bold text-sky-300">
                {profile.firstname} {profile.lastname}
              </h2>
              <p className="text-gray-400 text-sm">{profile.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn bg-sky-500 hover:bg-sky-600 text-white"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-200">
          <div className="bg-slate-700 rounded-xl p-5 border border-sky-400">
            <h3 className="text-xl text-lime-300 font-semibold mb-3">Personal Info</h3>
            <p><span className="font-bold">Phone:</span> {profile.contactPhone || 'N/A'}</p>
            <p><span className="font-bold">Role:</span> {profile.role}</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-5 border border-sky-400">
            <h3 className="text-xl text-lime-300 font-semibold mb-3">Location & Joined</h3>
            <p><span className="font-bold">Address:</span> {profile.address || 'N/A'}</p>
            <p><span className="font-bold">Joined:</span> {new Date(profile.createdAt ?? '').toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open bg-black/60 backdrop-blur-sm">
          <div className="modal-box bg-slate-900 border border-sky-500 text-white max-w-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
              title="Close modal"
            >
              <X size={12} />
            </button>

            <h3 className="text-xl font-semibold text-lime-300 mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sky-400">First Name</label>
                <input
                  type="text"
                  {...register('firstname', { required: 'First name is required' })}
                  className="input w-full bg-slate-800 border border-gray-600 text-white"
                />
                {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
              </div>
              <div>
                <label className="text-sky-400">Last Name</label>
                <input
                  type="text"
                  {...register('lastname', { required: 'Last name is required' })}
                  className="input w-full bg-slate-800 border border-gray-600 text-white"
                />
                {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
              </div>
              <div>
                <label className="text-sky-400">Email</label>
                <input
                  type="email"
                  disabled
                  {...register('email')}
                  className="input w-full bg-slate-800 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sky-400">Phone</label>
                <input
                  type="tel"
                  {...register('contactPhone')}
                  className="input w-full bg-slate-800 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sky-400">Address</label>
                <textarea
                  {...register('address')}
                  className="textarea w-full bg-slate-800 border border-gray-600 text-white"
                />
              </div>
              <div className="modal-action flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn bg-sky-500 hover:bg-sky-600 text-white" disabled={isUpdating}>
                  <Save size={16} /> {isUpdating ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserProfile;
