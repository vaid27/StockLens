import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Palette, Globe, Shield, Trash2, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

        {/* Settings Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
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