"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  ExternalLink,
  Home,
  Users,
  Shield,
  Wifi,
  Car,
  Zap,
  Droplets,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BlockPhoto {
  url: string;
  title: string;
  description?: string;
  type: 'boys' | 'girls' | 'common' | 'exterior' | 'interior' | 'amenities';
  isMain?: boolean;
}

interface BlockProfile {
  _id?: string;
  basicInfo: {
    name: string;
    description: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    contactNumber: string;
    email: string;
  };
  propertyDetails: {
    totalFloors: number;
    totalRooms: number;
    accommodationType: 'boys' | 'girls' | 'coed' | 'separate';
    establishedYear?: number;
    buildingType: 'independent' | 'apartment' | 'commercial';
  };
  locationInfo: {
    googleMapLink?: string;
    latitude?: number;
    longitude?: number;
    nearbyLandmarks: Array<{
      name: string;
      distance: string;
      type: 'hospital' | 'school' | 'market' | 'transport' | 'other';
    }>;
    transportConnectivity: Array<{
      mode: 'bus' | 'metro' | 'train' | 'auto';
      distance: string;
      details: string;
    }>;
  };
  media: {
    photos: BlockPhoto[];
    virtualTourLink?: string;
  };
  amenities: Array<{
    name: string;
    available: boolean;
    description?: string;
    floor?: string;
  }>;
  safetyFeatures: Array<{
    feature: string;
    available: boolean;
    details?: string;
  }>;
}

const defaultAmenities = [
  { name: "Wi-Fi", available: false, description: "", floor: "" },
  { name: "Laundry Service", available: false, description: "", floor: "" },
  { name: "AC Rooms", available: false, description: "", floor: "" },
  { name: "Power Backup", available: false, description: "", floor: "" },
  { name: "Housekeeping", available: false, description: "", floor: "" },
  { name: "RO Water", available: false, description: "", floor: "" },
  { name: "Common Kitchen", available: false, description: "", floor: "" },
  { name: "Study Room", available: false, description: "", floor: "" },
  { name: "Recreation Area", available: false, description: "", floor: "" },
  { name: "Gym", available: false, description: "", floor: "" },
];

const defaultSafetyFeatures = [
  { feature: "CCTV Surveillance", available: false, details: "" },
  { feature: "Security Guard", available: false, details: "" },
  { feature: "Biometric Access", available: false, details: "" },
  { feature: "Fire Safety Equipment", available: false, details: "" },
  { feature: "Emergency Exit", available: false, details: "" },
  { feature: "First Aid Kit", available: false, details: "" },
];

export default function BlockProfilePage() {
  const params = useParams();
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [blockInfo, setBlockInfo] = useState<any>(null);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    title: "",
    description: "",
    type: "common" as BlockPhoto['type'],
    file: null as File | null,
  });
  
  const [profile, setProfile] = useState<BlockProfile>({
    basicInfo: {
      name: "",
      description: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      contactNumber: "",
      email: "",
    },
    propertyDetails: {
      totalFloors: 1,
      totalRooms: 1,
      accommodationType: 'boys',
      establishedYear: new Date().getFullYear(),
      buildingType: 'independent',
    },
    locationInfo: {
      googleMapLink: "",
      latitude: undefined,
      longitude: undefined,
      nearbyLandmarks: [],
      transportConnectivity: [],
    },
    media: {
      photos: [],
      virtualTourLink: "",
    },
    amenities: defaultAmenities,
    safetyFeatures: defaultSafetyFeatures,
  });

  useEffect(() => {
    fetchBlockProfile();
  }, [params.blockId]);

  const fetchBlockProfile = async () => {
    if (!user?.id || !params.blockId) return;
    
    try {
      // First get basic block info
      const blockResponse = await fetch(`/api/users/${user.id}/block/${params.blockId}`);
      const blockData = await blockResponse.json();
      setBlockInfo(blockData);
      
      // Then get block profile
      const profileResponse = await fetch(`/api/blocks/${params.blockId}/profile`);
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      } else {
        // If no profile exists, use default with block name
        setProfile(prev => ({
          ...prev,
          basicInfo: {
            ...prev.basicInfo,
            name: blockData.name,
            email: user.primaryEmailAddress?.emailAddress || "",
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching block profile:", error);
      toast({
        title: "Error",
        description: "Failed to load block profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/blocks/${params.blockId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      toast({
        title: "Success",
        description: "Block profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save block profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoForm.file || !photoForm.title) {
      toast({
        title: "Error",
        description: "Please provide a title and select a photo",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", photoForm.file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      const result = await response.json();
      
      const newPhoto: BlockPhoto = {
        url: result.secure_url,
        title: photoForm.title,
        description: photoForm.description,
        type: photoForm.type,
        isMain: profile.media.photos.length === 0, // First photo is main by default
      };

      setProfile(prev => ({
        ...prev,
        media: {
          ...prev.media,
          photos: [...prev.media.photos, newPhoto],
        }
      }));

      setPhotoForm({
        title: "",
        description: "",
        type: "common",
        file: null,
      });

      setIsPhotoDialogOpen(false);

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setProfile(prev => ({
      ...prev,
      media: {
        ...prev.media,
        photos: prev.media.photos.filter((_, i) => i !== index),
      }
    }));
  };

  const setMainPhoto = (index: number) => {
    setProfile(prev => ({
      ...prev,
      media: {
        ...prev.media,
        photos: prev.media.photos.map((photo, i) => ({
          ...photo,
          isMain: i === index,
        })),
      }
    }));
  };

  const addLandmark = () => {
    setProfile(prev => ({
      ...prev,
      locationInfo: {
        ...prev.locationInfo,
        nearbyLandmarks: [
          ...prev.locationInfo.nearbyLandmarks,
          { name: "", distance: "", type: "other" }
        ]
      }
    }));
  };

  const removeLandmark = (index: number) => {
    setProfile(prev => ({
      ...prev,
      locationInfo: {
        ...prev.locationInfo,
        nearbyLandmarks: prev.locationInfo.nearbyLandmarks.filter((_, i) => i !== index)
      }
    }));
  };

  const addTransport = () => {
    setProfile(prev => ({
      ...prev,
      locationInfo: {
        ...prev.locationInfo,
        transportConnectivity: [
          ...prev.locationInfo.transportConnectivity,
          { mode: "bus", distance: "", details: "" }
        ]
      }
    }));
  };

  const removeTransport = (index: number) => {
    setProfile(prev => ({
      ...prev,
      locationInfo: {
        ...prev.locationInfo,
        transportConnectivity: prev.locationInfo.transportConnectivity.filter((_, i) => i !== index)
      }
    }));
  };

  const updateAmenity = (index: number, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      amenities: prev.amenities.map((amenity, i) =>
        i === index ? { ...amenity, [field]: value } : amenity
      )
    }));
  };

  const updateSafetyFeature = (index: number, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      safetyFeatures: prev.safetyFeatures.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const getPhotoTypeLabel = (type: string) => {
    switch (type) {
      case 'boys': return 'Boys Section';
      case 'girls': return 'Girls Section';
      case 'common': return 'Common Areas';
      case 'exterior': return 'Building Exterior';
      case 'interior': return 'Interior Spaces';
      case 'amenities': return 'Amenities';
      default: return type;
    }
  };

  const getPhotoTypeBadge = (type: string) => {
    const colors = {
      boys: 'bg-blue-100 text-blue-800',
      girls: 'bg-pink-100 text-pink-800',
      common: 'bg-green-100 text-green-800',
      exterior: 'bg-orange-100 text-orange-800',
      interior: 'bg-purple-100 text-purple-800',
      amenities: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {getPhotoTypeLabel(type)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <LoadingSkeleton className="h-10 w-64" />
          <LoadingSkeleton className="h-6 w-96 mt-2" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Block Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage detailed information about your block
        </p>
      </div>

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
              <Label htmlFor="blockName">Block Name</Label>
              <Input
                id="blockName"
                value={profile.basicInfo.name}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, name: e.target.value }
                }))}
                placeholder="Enter block name"
              />
            </div>
            
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profile.basicInfo.description}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                basicInfo: { ...prev.basicInfo, description: e.target.value }
              }))}
              placeholder="Enter block description"
              rows={3}
            />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                value={profile.basicInfo.landmark}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, landmark: e.target.value }
                }))}
                placeholder="Enter landmark"
              />
            </div>
            
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
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={profile.basicInfo.state}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  basicInfo: { ...prev.basicInfo, state: e.target.value }
                }))}
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Home className="h-5 w-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalFloors">Total Floors</Label>
              <Input
                id="totalFloors"
                type="number"
                min="1"
                value={profile.propertyDetails.totalFloors}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  propertyDetails: { ...prev.propertyDetails, totalFloors: parseInt(e.target.value) || 1 }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalRooms">Total Rooms</Label>
              <Input
                id="totalRooms"
                type="number"
                min="1"
                value={profile.propertyDetails.totalRooms}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  propertyDetails: { ...prev.propertyDetails, totalRooms: parseInt(e.target.value) || 1 }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input
                id="establishedYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={profile.propertyDetails.establishedYear || ""}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  propertyDetails: { ...prev.propertyDetails, establishedYear: parseInt(e.target.value) || undefined }
                }))}
                placeholder="Enter year"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Accommodation Type</Label>
              <Select
                value={profile.propertyDetails.accommodationType}
                onValueChange={(value: 'boys' | 'girls' | 'coed' | 'separate') => 
                  setProfile(prev => ({
                    ...prev,
                    propertyDetails: { ...prev.propertyDetails, accommodationType: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accommodation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys Only</SelectItem>
                  <SelectItem value="girls">Girls Only</SelectItem>
                  <SelectItem value="coed">Co-ed (Mixed)</SelectItem>
                  <SelectItem value="separate">Separate Boys & Girls</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Building Type</Label>
              <Select
                value={profile.propertyDetails.buildingType}
                onValueChange={(value: 'independent' | 'apartment' | 'commercial') => 
                  setProfile(prev => ({
                    ...prev,
                    propertyDetails: { ...prev.propertyDetails, buildingType: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select building type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="independent">Independent Building</SelectItem>
                  <SelectItem value="apartment">Apartment Complex</SelectItem>
                  <SelectItem value="commercial">Commercial Building</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="googleMapLink">Google Maps Link</Label>
            <div className="flex gap-2">
              <Input
                id="googleMapLink"
                value={profile.locationInfo.googleMapLink || ""}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  locationInfo: { ...prev.locationInfo, googleMapLink: e.target.value }
                }))}
                placeholder="Paste Google Maps link"
              />
              {profile.locationInfo.googleMapLink && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(profile.locationInfo.googleMapLink, '_blank')}
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
                onClick={addLandmark}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Landmark
              </Button>
            </div>
            
            <div className="space-y-3">
              {profile.locationInfo.nearbyLandmarks.map((landmark, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                  <Input
                    placeholder="Landmark name"
                    value={landmark.name}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      locationInfo: {
                        ...prev.locationInfo,
                        nearbyLandmarks: prev.locationInfo.nearbyLandmarks.map((item, i) =>
                          i === index ? { ...item, name: e.target.value } : item
                        )
                      }
                    }))}
                  />
                  <Input
                    placeholder="Distance (e.g., 500m)"
                    value={landmark.distance}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      locationInfo: {
                        ...prev.locationInfo,
                        nearbyLandmarks: prev.locationInfo.nearbyLandmarks.map((item, i) =>
                          i === index ? { ...item, distance: e.target.value } : item
                        )
                      }
                    }))}
                  />
                  <Select
                    value={landmark.type}
                    onValueChange={(value: 'hospital' | 'school' | 'market' | 'transport' | 'other') => 
                      setProfile(prev => ({
                        ...prev,
                        locationInfo: {
                          ...prev.locationInfo,
                          nearbyLandmarks: prev.locationInfo.nearbyLandmarks.map((item, i) =>
                            i === index ? { ...item, type: value } : item
                          )
                        }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="school">School/College</SelectItem>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="transport">Transport Hub</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeLandmark(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Transport Connectivity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Transport Connectivity</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addTransport}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transport
              </Button>
            </div>
            
            <div className="space-y-3">
              {profile.locationInfo.transportConnectivity.map((transport, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                  <Select
                    value={transport.mode}
                    onValueChange={(value: 'bus' | 'metro' | 'train' | 'auto') => 
                      setProfile(prev => ({
                        ...prev,
                        locationInfo: {
                          ...prev.locationInfo,
                          transportConnectivity: prev.locationInfo.transportConnectivity.map((item, i) =>
                            i === index ? { ...item, mode: value } : item
                          )
                        }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="metro">Metro</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="auto">Auto/Taxi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Distance"
                    value={transport.distance}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      locationInfo: {
                        ...prev.locationInfo,
                        transportConnectivity: prev.locationInfo.transportConnectivity.map((item, i) =>
                          i === index ? { ...item, distance: e.target.value } : item
                        )
                      }
                    }))}
                  />
                  <Input
                    placeholder="Details"
                    value={transport.details}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      locationInfo: {
                        ...prev.locationInfo,
                        transportConnectivity: prev.locationInfo.transportConnectivity.map((item, i) =>
                          i === index ? { ...item, details: e.target.value } : item
                        )
                      }
                    }))}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeTransport(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Block Photos</h3>
              <p className="text-sm text-muted-foreground">
                Upload photos to showcase your block
              </p>
            </div>
            <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Block Photo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="photoTitle">Photo Title</Label>
                    <Input
                      id="photoTitle"
                      value={photoForm.title}
                      onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter photo title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photoDescription">Description (Optional)</Label>
                    <Textarea
                      id="photoDescription"
                      value={photoForm.description}
                      onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter photo description"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Photo Type</Label>
                    <Select
                      value={photoForm.type}
                      onValueChange={(value: BlockPhoto['type']) => 
                        setPhotoForm(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boys">Boys Section</SelectItem>
                        <SelectItem value="girls">Girls Section</SelectItem>
                        <SelectItem value="common">Common Areas</SelectItem>
                        <SelectItem value="exterior">Building Exterior</SelectItem>
                        <SelectItem value="interior">Interior Spaces</SelectItem>
                        <SelectItem value="amenities">Amenities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photoFile">Select Photo</Label>
                    <Input
                      id="photoFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhotoForm(prev => ({ 
                        ...prev, 
                        file: e.target.files?.[0] || null 
                      }))}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsPhotoDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePhotoUpload}
                      disabled={uploading || !photoForm.file || !photoForm.title}
                    >
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {profile.media.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.media.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    {getPhotoTypeBadge(photo.type)}
                    {photo.isMain && (
                      <Badge className="ml-1 bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Main
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      {!photo.isMain && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setMainPhoto(index)}
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium text-sm">{photo.title}</h4>
                    {photo.description && (
                      <p className="text-xs text-muted-foreground">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No photos uploaded yet</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="virtualTourLink">Virtual Tour Link (Optional)</Label>
            <Input
              id="virtualTourLink"
              value={profile.media.virtualTourLink || ""}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                media: { ...prev.media, virtualTourLink: e.target.value }
              }))}
              placeholder="Enter virtual tour link"
            />
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Amenities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.amenities.map((amenity, index) => (
              <div key={amenity.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={amenity.available}
                    onCheckedChange={(checked) => 
                      updateAmenity(index, 'available', checked as boolean)
                    }
                  />
                  <span className="font-medium">{amenity.name}</span>
                </div>
                {amenity.available && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Floor"
                      value={amenity.floor || ""}
                      onChange={(e) => updateAmenity(index, 'floor', e.target.value)}
                      className="w-20 h-8"
                    />
                    <Input
                      placeholder="Details"
                      value={amenity.description || ""}
                      onChange={(e) => updateAmenity(index, 'description', e.target.value)}
                      className="w-32 h-8"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.safetyFeatures.map((feature, index) => (
              <div key={feature.feature} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={feature.available}
                    onCheckedChange={(checked) => 
                      updateSafetyFeature(index, 'available', checked as boolean)
                    }
                  />
                  <span className="font-medium">{feature.feature}</span>
                </div>
                {feature.available && (
                  <Input
                    placeholder="Details"
                    value={feature.details || ""}
                    onChange={(e) => updateSafetyFeature(index, 'details', e.target.value)}
                    className="w-32 h-8"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || uploading} size="lg">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}