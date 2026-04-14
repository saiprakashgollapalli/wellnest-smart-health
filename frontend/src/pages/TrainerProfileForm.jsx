import { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function TrainerProfileForm() {
  const [profile, setProfile] = useState({
    title: '',
    specialization: '',
    experienceYears: '',
    phoneNumber: '',
    bio: '',
    servicesOffered: '',
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    setFetching(true);
    try {
      const response = await trainerService.getMyProfile();
      console.log("Profile response:", response.data);
      
      if (response.data && response.data.id) {
        setProfile(response.data);
        setHasProfile(true);
        toast.success('Profile loaded');
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      console.log('No existing profile, showing empty form');
      setHasProfile(false);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!profile.title.trim()) {
      toast.error("Please enter your professional title");
      setLoading(false);
      return;
    }
    if (!profile.specialization) {
      toast.error("Please select a specialization");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...profile,
        experienceYears: profile.experienceYears === '' ? null : Number(profile.experienceYears)
      };
      
      console.log("Saving profile:", payload);
      const response = await trainerService.saveMyProfile(payload);
      console.log("Save response:", response.data);
      
      toast.success(hasProfile ? "Profile updated successfully!" : "Profile created successfully!");
      setHasProfile(true);
      setIsEditing(false);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error("Save error:", err);
      console.error("Error response:", err.response);
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {hasProfile ? "Edit Trainer Profile" : "Create Trainer Profile"}
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          {hasProfile 
            ? "Update your professional information" 
            : "Complete your profile to appear in the trainers directory"}
        </p>
      </div>

      {hasProfile && !isEditing ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)]">Professional Title</h3>
              <p className="text-lg">{profile.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)]">Specialization</h3>
              <p className="text-lg">{profile.specialization}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)]">Experience</h3>
              <p className="text-lg">{profile.experienceYears} Years</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)]">Phone</h3>
              <p className="text-lg">{profile.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)]">Bio</h3>
              <p className="text-lg whitespace-pre-wrap">{profile.bio}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)]">Services Offered</h3>
              <p className="text-lg whitespace-pre-wrap">{profile.servicesOffered}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)]">Availability</h3>
              <p className={`text-lg font-medium ${profile.isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
                {profile.isAvailable ? 'Available for new clients' : 'Not available'}
              </p>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary px-6 py-3 rounded-lg font-semibold"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Professional Title *
          </label>
          <input
            type="text"
            name="title"
            value={profile.title}
            onChange={handleChange}
            placeholder="e.g., Certified Strength & Conditioning Coach"
            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Specialization *
          </label>
          <select
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          >
            <option value="">Select Specialization</option>
            <option value="Yoga & Meditation">Yoga & Meditation</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Cardio & HIIT">Cardio & HIIT</option>
            <option value="Nutrition & Diet">Nutrition & Diet</option>
            <option value="Pilates & Core">Pilates & Core</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Rehabilitation">Rehabilitation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            name="experienceYears"
            value={profile.experienceYears}
            onChange={handleChange}
            placeholder="e.g., 5"
            min="0"
            max="50"
            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            placeholder="+91 XXXXXXXXXX"
            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Bio / About You
          </label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell users about your training philosophy, certifications, and approach..."
            rows="5"
            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Services Offered
          </label>
          <textarea
            name="servicesOffered"
            value={profile.servicesOffered}
            onChange={handleChange}
            placeholder="One-on-one coaching, Group sessions, Online training, Custom meal plans, etc."
            rows="3"
            className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isAvailable"
            checked={profile.isAvailable}
            onChange={handleChange}
            className="w-5 h-5 rounded border-[var(--border)] text-emerald-500 focus:ring-emerald-500"
          />
          <label className="text-sm font-medium">
            Available for new clients
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : (hasProfile ? "Update Profile" : "Create Profile")}
          </button>
          <button
            type="button"
            onClick={() => hasProfile ? setIsEditing(false) : navigate('/dashboard')}
            className="btn-ghost px-6 py-3 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
      )}
    </div>
  );
}