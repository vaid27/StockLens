import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Palette, Shield, Trash2, Save, Check, User, Lock, AlertCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Settings({ isDark = true }) {
  const { user, updateProfile, changePassword } = useAuth();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      notifications: {
        priceAlerts: true,
        newsAlerts: false,
        predictionAlerts: true,
        emailDigest: false,
      },
      display: {
        currency: 'USD',
        language: 'en',
        compactMode: false,
        showPercentages: true,
      },
      data: {
        autoRefresh: true,
        refreshInterval: '30',
        cacheData: true,
      }
    };
  });

  // Profile state
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
  });

  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // UI state
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProfileUpdate = async () => {
    try {
      setError('');
      const result = await updateProfile(profileData);
      if (result.success) {
        setSuccessMsg('Profile updated successfully');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    setError('');
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const result = await changePassword(passwordForm.old_password, passwordForm.new_password);
      if (result.success) {
        setSuccessMsg('Password changed successfully');
        setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
        setShowPasswordForm(false);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to change password');
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const clearData = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to clear all local data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgInput = isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-gray-200';

  const sections = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      iconColor: 'text-amber-400',
      settings: [
        { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when prices cross your targets', type: 'switch' },
        { key: 'newsAlerts', label: 'News Alerts', desc: 'Receive breaking news notifications', type: 'switch' },
        { key: 'predictionAlerts', label: 'Prediction Updates', desc: 'New ML predictions available', type: 'switch' },
        { key: 'emailDigest', label: 'Email Digest', desc: 'Weekly summary of your watchlist', type: 'switch' },
      ]
    },
    {
      id: 'display',
      title: 'Display',
      icon: Palette,
      iconColor: 'text-purple-400',
      settings: [
        { key: 'currency', label: 'Currency', desc: 'Default currency for prices', type: 'select', options: ['USD', 'EUR', 'GBP', 'JPY', 'INR'] },
        { key: 'language', label: 'Language', desc: 'Interface language', type: 'select', options: ['en', 'es', 'fr', 'de', 'zh'] },
        { key: 'compactMode', label: 'Compact Mode', desc: 'Show more content in less space', type: 'switch' },
        { key: 'showPercentages', label: 'Show Percentages', desc: 'Display percentage changes', type: 'switch' },
      ]
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      icon: Shield,
      iconColor: 'text-cyan-400',
      settings: [
        { key: 'autoRefresh', label: 'Auto Refresh', desc: 'Automatically refresh market data', type: 'switch' },
        { key: 'refreshInterval', label: 'Refresh Interval', desc: 'How often to refresh data', type: 'select', options: ['10', '30', '60', '300'] },
        { key: 'cacheData', label: 'Cache Data', desc: 'Store data locally for faster loading', type: 'switch' },
      ]
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textPrimary} flex items-center gap-3`}>
            <SettingsIcon className="w-8 h-8 text-cyan-400" />
            Settings
          </h1>
          <p className={`${textSecondary} mt-1`}>
            Customize your trading experience
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-gap-2">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-sm">{successMsg}</p>
          </motion.div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bgCard} border ${borderColor} rounded-xl overflow-hidden`}
          >
            <div className={`px-6 py-4 border-b ${borderColor} flex items-center gap-3`}>
              <User className="w-5 h-5 text-cyan-400" />
              <h2 className={`${textPrimary} font-semibold`}>Profile</h2>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div>
                <Label className={textPrimary}>First Name</Label>
                <Input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                  placeholder="John"
                  className={bgInput}
                />
              </div>

              <div>
                <Label className={textPrimary}>Last Name</Label>
                <Input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                  placeholder="Doe"
                  className={bgInput}
                />
              </div>

              <div>
                <Label className={textPrimary}>Bio</Label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${bgInput} ${textPrimary}`}
                  rows="4"
                />
              </div>

              <Button
                onClick={handleProfileUpdate}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                Save Profile
              </Button>
            </div>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${bgCard} border ${borderColor} rounded-xl overflow-hidden`}
          >
            <div className={`px-6 py-4 border-b ${borderColor} flex items-center gap-3 justify-between`}>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-400" />
                <h2 className={`${textPrimary} font-semibold`}>Password</h2>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                {showPasswordForm ? 'Cancel' : 'Change'}
              </button>
            </div>

            {showPasswordForm && (
              <div className="px-6 py-6 space-y-4">
                <div>
                  <Label className={textPrimary}>Current Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.old_password}
                    onChange={(e) => setPasswordForm({...passwordForm, old_password: e.target.value})}
                    placeholder="••••••••"
                    className={bgInput}
                  />
                </div>

                <div>
                  <Label className={textPrimary}>New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                    placeholder="••••••••"
                    className={bgInput}
                  />
                </div>

                <div>
                  <Label className={textPrimary}>Confirm Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                    placeholder="••••••••"
                    className={bgInput}
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  Change Password
                </Button>
              </div>
            )}
          </motion.div>
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (sectionIndex + 2) * 0.1 }}
              className={`${bgCard} border ${borderColor} rounded-xl overflow-hidden`}
            >
              <div className={`px-6 py-4 border-b ${borderColor} flex items-center gap-3`}>
                <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                <h2 className={`${textPrimary} font-semibold`}>{section.title}</h2>
              </div>
              
              <div className="divide-y divide-[#2a2e39]">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>{setting.label}</p>
                      <p className={`text-sm ${textSecondary}`}>{setting.desc}</p>
                    </div>
                    
                    {setting.type === 'switch' && (
                      <Switch
                        checked={settings[section.id][setting.key]}
                        onCheckedChange={(checked) => updateSetting(section.id, setting.key, checked)}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                    )}
                    
                    {setting.type === 'select' && (
                      <Select
                        value={settings[section.id][setting.key]}
                        onValueChange={(value) => updateSetting(section.id, setting.key, value)}
                      >
                        <SelectTrigger className={`w-32 ${bgInput} ${textPrimary}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={bgCard}>
                          {setting.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {setting.key === 'refreshInterval' ? `${opt}s` : opt.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Danger Zone */}
          <div className={`${bgCard} border border-red-500/30 rounded-xl overflow-hidden`}>
            <div className={`px-6 py-4 border-b border-red-500/30 flex items-center gap-3`}>
              <Trash2 className="w-5 h-5 text-red-400" />
              <h2 className="text-red-400 font-semibold">Danger Zone</h2>
            </div>
            
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className={`${textPrimary} font-medium`}>Clear All Data</p>
                <p className={`text-sm ${textSecondary}`}>Remove all local data including watchlist and settings</p>
              </div>
              <Button 
                variant="outline" 
                onClick={clearData}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Clear Data
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave}
            className={`${saved ? 'bg-emerald-500' : 'bg-cyan-500 hover:bg-cyan-600'} text-white px-6`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}