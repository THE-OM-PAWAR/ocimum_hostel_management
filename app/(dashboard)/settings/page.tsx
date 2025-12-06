"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin, Building2, Sun, Moon, Laptop, Download, Smartphone, AlertCircle, CheckCircle, Globe, Users, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Owner {
  _id: string;
  userId: string;
  ownerName: string;
  organisationName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  pan?: string;
  createdAt: string;
  updatedAt: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<'checking' | 'available' | 'not-available' | 'installed'>('checking');

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/owners/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch owner data');
        }
        const data = await response.json();
        setOwner(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching owner data:', error);
        setError('Failed to load owner data');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;

    const checkInstallStatus = () => {
      // Check if app is already installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const installed = isStandalone || isInWebAppiOS;
      
      if (mounted) {
        setIsInstalled(installed);
        if (installed) {
          setInstallStatus('installed');
          return;
        }
      }

      // Check if installation is supported
      const isHttps = location.protocol === 'https:' || location.hostname === 'localhost';
      const hasServiceWorker = 'serviceWorker' in navigator;
      
      if (!isHttps || !hasServiceWorker) {
        if (mounted) {
          setInstallStatus('not-available');
        }
        return;
      }

      // Set up install prompt listener
      const handleBeforeInstallPrompt = (e: Event) => {
        console.log('beforeinstallprompt event fired');
        e.preventDefault();
        if (mounted) {
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setInstallStatus('available');
        }
      };

      const handleAppInstalled = () => {
        console.log('App installed');
        if (mounted) {
          setIsInstalled(true);
          setInstallStatus('installed');
          setDeferredPrompt(null);
          toast({
            title: "Success!",
            description: "Getstay has been installed on your device",
          });
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Fallback: if no prompt after 3 seconds, check if we can still install
      const fallbackTimer = setTimeout(() => {
        if (mounted && !deferredPrompt && !installed) {
          // Check if we're in a PWA-capable environment
          if (isHttps && hasServiceWorker) {
            setInstallStatus('not-available');
          }
        }
      }, 3000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        clearTimeout(fallbackTimer);
      };
    };

    const cleanup = checkInstallStatus();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, [toast, deferredPrompt]);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          toast({
            title: "Installing...",
            description: "Getstay is being installed on your device",
          });
        } else {
          toast({
            title: "Installation cancelled",
            description: "You can install the app anytime from the settings",
          });
        }
      } catch (error) {
        console.error('Installation error:', error);
        toast({
          title: "Installation failed",
          description: "Please try again or use your browser's install option",
          variant: "destructive",
        });
      } finally {
        setIsInstalling(false);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let instructions = "Open your browser menu and look for 'Install app' or 'Add to Home Screen'";
      
      if (isIOS) {
        instructions = "Tap the Share button in Safari, then select 'Add to Home Screen'";
      } else if (isAndroid) {
        instructions = "Tap the menu (⋮) in Chrome, then select 'Install app' or 'Add to Home screen'";
      }
      
      toast({
        title: "Manual Installation",
        description: instructions,
      });
    }
  };

  const handleLogout = () => {
    signOut(() => {
      router.push(`/`);
      console.log("User logged out");
    });
  };

  const getInstallButtonContent = () => {
    if (isInstalling) {
      return (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Installing...
        </>
      );
    }

    switch (installStatus) {
      case 'installed':
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            Installed
          </>
        );
      case 'available':
        return (
          <>
            <Download className="h-4 w-4" />
            Install App
          </>
        );
      case 'not-available':
        return (
          <>
            <Smartphone className="h-4 w-4" />
            Install Guide
          </>
        );
      default:
        return (
          <>
            <Download className="h-4 w-4" />
            Install App
          </>
        );
    }
  };

  const getStatusMessage = () => {
    switch (installStatus) {
      case 'installed':
        return (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Getstay is installed on your device</span>
          </div>
        );
      case 'available':
        return (
          <p className="text-sm text-muted-foreground">
            Install Getstay as an app for faster access and offline capabilities
          </p>
        );
      case 'not-available':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Automatic installation not available</span>
            </div>
            <p className="text-xs text-muted-foreground">
              You can still install manually through your browser menu
            </p>
          </div>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Checking installation availability...
          </p>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
          <LoadingSkeleton className="h-8 w-48" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i ) => (
              <LoadingSkeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="text-destructive">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">{owner?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-muted-foreground">{owner?.ownerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p className="text-muted-foreground">{owner?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Address</label>
                <p className="text-muted-foreground">{owner?.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <p className="text-muted-foreground">{owner?.city || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <p className="text-muted-foreground">{owner?.state || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Business Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">GSTIN</label>
                <p className="text-muted-foreground">{owner?.gstin || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">PAN</label>
                <p className="text-muted-foreground">{owner?.pan || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Organisation Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Online Presence</h3>
              <p className="text-sm text-muted-foreground">Manage your organisation's online profile and visibility</p>
            </div>
            {/* Organisation Profile feature removed - isOnlinePresenceEnabled is now in Organisation model */}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Hostel Profiles</h3>
              <p className="text-sm text-muted-foreground">Manage detailed information for each hostel</p>
            </div>
            <Button
              onClick={() => router.push('/settings/hostel-profiles')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Manage Hostels
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage users and their permissions</p>
            </div>
            <Button
              onClick={() => router.push('/settings/users')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Install App</h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Install Getstay App</h3>
              </div>
              
              {getStatusMessage()}
            </div>
            
            <Button
              onClick={handleInstallApp}
              disabled={isInstalling}
              className="flex items-center gap-2 min-w-[140px]"
              variant={installStatus === 'installed' ? "outline" : "default"}
            >
              {getInstallButtonContent()}
            </Button>
          </div>
          
          {installStatus !== 'installed' && (
            <div className="mt-4 p-4 bg-muted/50 rounded-md">
              <h4 className="text-sm font-medium mb-2">Benefits of installing:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Faster loading and better performance</li>
                <li>• Works offline for basic features</li>
                <li>• Easy access from your home screen</li>
                <li>• Native app-like experience</li>
                <li>• Push notifications (coming soon)</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Logout</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}