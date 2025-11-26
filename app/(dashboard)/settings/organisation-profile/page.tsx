"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  Globe, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Utensils, 
  Shield, 
  Wifi, 
  Car, 
  Zap, 
  Droplets,
  Camera,
  Upload,
  X,
  Plus,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface Facility {
  name: string;
  available: boolean;
  details?: string;
}

interface LocationFactor {
  name: string;
  distance: string;
  description?: string;
}

interface OrganisationProfile {
  _id?: string;
  isOnlinePresenceEnabled: boolean;
  basicInfo: {
    name: string;
    address: string;
    landmark: string;
    city: string;
    pincode: string;
    contactNumber: string;
    email: string;
  };
  propertyDetails: {
    type: 'boys' | 'girls' | 'coed' | 'separate';
    facilities: Facility[];
    foodService: {
      available: boolean;
      type?: 'veg' | 'nonveg' | 'both';
      details?: string;
    };
  };
  rulesAndPolicies: string;
  media: {
    bannerImage?: string;
    profileImage?: string;
    galleryImages: string[];
  };
  locationFactors: {
    nearbyLandmarks: LocationFactor[];
    googleMapLink?: string;
    coachingCenters: LocationFactor[];
  };
}

const defaultFacilities: Facility[] = [
  { name: "Wi-Fi", available: false, details: "" },
  { name: "Laundry Service", available: false, details: "" },
  { name: "AC Rooms", available: false, details: "" },
  { name: "Non-AC Rooms", available: false, details: "" },
  { name: "Power Backup", available: false, details: "" },
  { name: "Housekeeping", available: false, details: "" },
  { name: "RO Water", available: false, details: "" },
  { name: "CCTV Security", available: false, details: "" },
  { name: "Security Guard", available: false, details: "" },
  { name: "Warden", available: false, details: "" },
  { name: "Parking", available: false, details: "" },
  { name: "Common Room", available: false, details: "" },
  { name: "Study Room", available: false, details: "" },
  { name: "Gym", available: false, details: "" },
  { name: "Recreation Area", available: false, details: "" },
  { name: "Medical Facility", available: false, details: "" },
];

export default function OrganisationProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [organisationId, setOrganisationId] = useState<string>("");
  
  const [profile, setProfile] = useState<OrganisationProfile>({
    isOnlinePresenceEnabled: false,
    basicInfo: {
      name: "",
      address: "",
      landmark: "",
      city: "",
      pincode: "",
      contactNumber: "",
      email: "",
    },
    propertyDetails: {
      type: 'boys',
      facilities: defaultFacilities,
      foodService: {
        available: false,
        type: undefined,
        details: "",
      },
    },
    rulesAndPolicies: "",
    media: {
      bannerImage: "",
      profileImage: "",
      galleryImages: [],
    },
    locationFactors: {
      nearbyLandmarks: [],
      googleMapLink: "",
      coachingCenters: [],
    },
  });

  useEffect(() => {
    fetchOrganisationProfile();
  }, [user?.id]);

  const fetchOrganisationProfile = async () => {
    if (!user?.id) return;
    
    try {
      // First get organisation info
      const organisationResponse = await fetch(`/api/users/${user.id}/organisation-info`);
      const organisationData = await organisationResponse.json();
      
      if (organisationData.error) {
        throw new Error(organisationData.error);
      }
      
      console.log(organisationData)
      setOrganisationId(organisationData.organisationId);
      
      // Then get organisation profile
      const profileResponse = await fetch(`/api/organisations/${organisationData.organisationId}/profile`);
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      } else {
        // If no profile exists, use default with organisation name
        setProfile(prev => ({
          ...prev,
          basicInfo: {
            ...prev.basicInfo,
            name: organisationData.organisationName,
            email: user.primaryEmailAddress?.emailAddress || "",
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching organisation profile:", error);
      toast({
        title: "Error",
        description: "Failed to load organisation profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/organisations/${organisationId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      console.log("Profile saved:", profile);``

      toast({
        title: "Success",
        description: "Organisation profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save organisation profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'banner' | 'profile') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      
      setProfile(prev => ({
        ...prev,
        media: {
          ...prev.media,
          [type === 'banner' ? 'bannerImage' : 'profileImage']: result.secure_url,
        }
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addLocationFactor = (type: 'nearbyLandmarks' | 'coachingCenters') => {
    setProfile(prev => ({
      ...prev,
      locationFactors: {
        ...prev.locationFactors,
        [type]: [
          ...prev.locationFactors[type],
          { name: "", distance: "", description: "" }
        ]
      }
    }));
  };

  const removeLocationFactor = (type: 'nearbyLandmarks' | 'coachingCenters', index: number) => {
    setProfile(prev => ({
      ...prev,
      locationFactors: {
        ...prev.locationFactors,
        [type]: prev.locationFactors[type].filter((_, i) => i !== index)
      }
    }));
  };

  const updateLocationFactor = (
    type: 'nearbyLandmarks' | 'coachingCenters', 
    index: number, 
    field: keyof LocationFactor, 
    value: string
  ) => {
    setProfile(prev => ({
      ...prev,
      locationFactors: {
        ...prev.locationFactors,
        [type]: prev.locationFactors[type].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const updateFacility = (index: number, field: keyof Facility, value: boolean | string) => {
    setProfile(prev => ({
      ...prev,
      propertyDetails: {
        ...prev.propertyDetails,
        facilities: prev.propertyDetails.facilities.map((facility, i) =>
          i === index ? { ...facility, [field]: value } : facility
        )
      }
    }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Organisation Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organisation&apos;s online presence and showcase your property
        </p>
      </div>

      {/* Online Presence Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Online Presence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Online Presence</h3>
              <p className="text-sm text-muted-foreground">
                Make your organisation visible online with a public profile page
              </p>
            </div>
            <Switch
              checked={profile.isOnlinePresenceEnabled}
              onCheckedChange={(checked) => 
                setProfile(prev => ({ ...prev, isOnlinePresenceEnabled: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {profile.isOnlinePresenceEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organisationName">Organisation Name</Label>
                  <Input
                    id="organisationName"
                    value={profile.basicInfo.name}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, name: e.target.value }
                    }))}
                    placeholder="Enter organisation name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark/Area</Label>
                  <Input
                    id="landmark"
                    value={profile.basicInfo.landmark}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, landmark: e.target.value }
                    }))}
                    placeholder="Enter landmark or area"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={profile.basicInfo.address}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, address: e.target.value }
                  }))}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.basicInfo.city}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, city: e.target.value }
                    }))}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={profile.basicInfo.pincode}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, pincode: e.target.value }
                    }))}
                    placeholder="Enter PIN code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={profile.basicInfo.contactNumber}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, contactNumber: e.target.value }
                    }))}
                    placeholder="Enter contact number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.basicInfo.email}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, email: e.target.value }
                    }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Organisation Type</Label>
                <Select
                  value={profile.propertyDetails.type}
                  onValueChange={(value: 'boys' | 'girls' | 'coed' | 'separate') => 
                    setProfile(prev => ({
                      ...prev,
                      propertyDetails: { ...prev.propertyDetails, type: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organisation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys Only</SelectItem>
                    <SelectItem value="girls">Girls Only</SelectItem>
                    <SelectItem value="coed">Co-ed (Mixed)</SelectItem>
                    <SelectItem value="separate">Separate Boys & Girls Organisations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Facilities & Amenities</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.propertyDetails.facilities.map((facility, index) => (
                    <div key={facility.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={facility.available}
                          onCheckedChange={(checked) => 
                            updateFacility(index, 'available', checked as boolean)
                          }
                        />
                        <span className="font-medium">{facility.name}</span>
                      </div>
                      {facility.available && (
                        <Input
                          placeholder="Details"
                          value={facility.details || ""}
                          onChange={(e) => updateFacility(index, 'details', e.target.value)}
                          className="w-32 h-8"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Food/Mess Service</Label>
                    <p className="text-sm text-muted-foreground">Does your organisation provide food service?</p>
                  </div>
                  <Switch
                    checked={profile.propertyDetails.foodService.available}
                    onCheckedChange={(checked) => 
                      setProfile(prev => ({
                        ...prev,
                        propertyDetails: {
                          ...prev.propertyDetails,
                          foodService: { ...prev.propertyDetails.foodService, available: checked }
                        }
                      }))
                    }
                  />
                </div>

                {profile.propertyDetails.foodService.available && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Food Type</Label>
                      <Select
                        value={profile.propertyDetails.foodService.type}
                        onValueChange={(value: 'veg' | 'nonveg' | 'both') => 
                          setProfile(prev => ({
                            ...prev,
                            propertyDetails: {
                              ...prev.propertyDetails,
                              foodService: { ...prev.propertyDetails.foodService, type: value }
                            }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select food type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veg">Vegetarian Only</SelectItem>
                          <SelectItem value="nonveg">Non-Vegetarian Only</SelectItem>
                          <SelectItem value="both">Both Veg & Non-Veg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="foodDetails">Food Service Details</Label>
                      <Input
                        id="foodDetails"
                        value={profile.propertyDetails.foodService.details || ""}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          propertyDetails: {
                            ...prev.propertyDetails,
                            foodService: { ...prev.propertyDetails.foodService, details: e.target.value }
                          }
                        }))}
                        placeholder="e.g., 3 meals a day, breakfast included"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rules & Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rules & Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="rules">Rules & Policies (Markdown supported)</Label>
                <Textarea
                  id="rules"
                  value={profile.rulesAndPolicies}
                  onChange={(e) => setProfile(prev => ({ ...prev, rulesAndPolicies: e.target.value }))}
                  placeholder="Enter organisation rules and policies. You can use Markdown formatting."
                  rows={8}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  You can use Markdown syntax for formatting (e.g., **bold**, *italic*, - bullet points)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Photos & Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photos & Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner Image */}
              <div className="space-y-4">
                <Label>Banner Image (3:1 ratio)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  {profile.media.bannerImage ? (
                    <div className="relative">
                      <img
                        src={profile.media.bannerImage}
                        alt="Banner"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setProfile(prev => ({
                          ...prev,
                          media: { ...prev.media, bannerImage: "" }
                        }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a banner image (recommended: 1200x400px)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'banner');
                        }}
                        className="hidden"
                        id="banner-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="banner-upload" className="cursor-pointer">
                          Choose Banner Image
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <Label>Profile Image (1:1 ratio)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  {profile.media.profileImage ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={profile.media.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => setProfile(prev => ({
                          ...prev,
                          media: { ...prev.media, profileImage: "" }
                        }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a profile image (recommended: 400x400px)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'profile');
                        }}
                        className="hidden"
                        id="profile-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="profile-upload" className="cursor-pointer">
                          Choose Profile Image
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="googleMapLink">Google Maps Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="googleMapLink"
                    value={profile.locationFactors.googleMapLink || ""}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      locationFactors: { ...prev.locationFactors, googleMapLink: e.target.value }
                    }))}
                    placeholder="Paste Google Maps link"
                  />
                  {profile.locationFactors.googleMapLink && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(profile.locationFactors.googleMapLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              {/* Nearby Landmarks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Nearby Landmarks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLocationFactor('nearbyLandmarks')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Landmark
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {profile.locationFactors.nearbyLandmarks.map((landmark, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
                      <Input
                        placeholder="Landmark name"
                        value={landmark.name}
                        onChange={(e) => updateLocationFactor('nearbyLandmarks', index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Distance (e.g., 500m, 2km)"
                        value={landmark.distance}
                        onChange={(e) => updateLocationFactor('nearbyLandmarks', index, 'distance', e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Description (optional)"
                          value={landmark.description || ""}
                          onChange={(e) => updateLocationFactor('nearbyLandmarks', index, 'description', e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeLocationFactor('nearbyLandmarks', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Coaching Centers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Nearby Coaching Centers/Colleges</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLocationFactor('coachingCenters')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Center
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {profile.locationFactors.coachingCenters.map((center, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
                      <Input
                        placeholder="Center/College name"
                        value={center.name}
                        onChange={(e) => updateLocationFactor('coachingCenters', index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Distance (e.g., 1km, 15 min walk)"
                        value={center.distance}
                        onChange={(e) => updateLocationFactor('coachingCenters', index, 'distance', e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Description (optional)"
                          value={center.description || ""}
                          onChange={(e) => updateLocationFactor('coachingCenters', index, 'description', e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeLocationFactor('coachingCenters', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving || uploading} size="lg">
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}