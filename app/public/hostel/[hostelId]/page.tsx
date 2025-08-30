"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
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
  ExternalLink,
  Check,
  Building2,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

interface HostelProfile {
  _id: string;
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
    facilities: Array<{
      name: string;
      available: boolean;
      details?: string;
    }>;
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
    nearbyLandmarks: Array<{
      name: string;
      distance: string;
      description?: string;
    }>;
    googleMapLink?: string;
    coachingCenters: Array<{
      name: string;
      distance: string;
      description?: string;
    }>;
  };
}

export default function PublicHostelPage({ params }: { params: { hostelId: string } }) {
  const [profile, setProfile] = useState<HostelProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHostelProfile();
  }, [params.hostelId]);

  const fetchHostelProfile = async () => {
    try {
      const response = await fetch(`/api/hostels/${params.hostelId}/profile`);
      
      if (!response.ok) {
        throw new Error("Hostel profile not found");
      }

      const data = await response.json();
      
      if (!data.isOnlinePresenceEnabled) {
        throw new Error("This hostel's online presence is not enabled");
      }

      setProfile(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'boys': return 'Boys Only';
      case 'girls': return 'Girls Only';
      case 'coed': return 'Co-ed (Mixed)';
      case 'separate': return 'Separate Boys & Girls';
      default: return type;
    }
  };

  const getFoodTypeLabel = (type?: string) => {
    switch (type) {
      case 'veg': return 'Vegetarian';
      case 'nonveg': return 'Non-Vegetarian';
      case 'both': return 'Veg & Non-Veg';
      default: return 'Available';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Hostel Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            {error || "The hostel you're looking for doesn't exist or is not available online."}
          </p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {profile.media.bannerImage ? (
          <img
            src={profile.media.bannerImage}
            alt={profile.basicInfo.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container max-w-6xl mx-auto">
            <div className="flex items-end gap-6">
              {profile.media.profileImage && (
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={profile.media.profileImage}
                    alt={profile.basicInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {profile.basicInfo.name}
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.basicInfo.city}, {profile.basicInfo.pincode}</span>
                </div>
                <Badge className="mt-2 bg-white/20 text-white border-white/30">
                  {getPropertyTypeLabel(profile.propertyDetails.type)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About {profile.basicInfo.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        {profile.basicInfo.address}
                        {profile.basicInfo.landmark && `, ${profile.basicInfo.landmark}`}
                      </p>
                      <p className="text-muted-foreground">
                        {profile.basicInfo.city}, {profile.basicInfo.pincode}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-muted-foreground">{profile.basicInfo.contactNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{profile.basicInfo.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Facilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Facilities & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.propertyDetails.facilities
                      .filter(facility => facility.available)
                      .map((facility, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                            <Check className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">{facility.name}</p>
                            {facility.details && (
                              <p className="text-sm text-muted-foreground">{facility.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {profile.propertyDetails.foodService.available && (
                    <>
                      <Separator className="my-6" />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Utensils className="h-5 w-5" />
                          Food Service
                        </h3>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                            <Check className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {getFoodTypeLabel(profile.propertyDetails.foodService.type)}
                            </p>
                            {profile.propertyDetails.foodService.details && (
                              <p className="text-sm text-muted-foreground">
                                {profile.propertyDetails.foodService.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Rules & Policies */}
            {profile.rulesAndPolicies && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Rules & Policies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{profile.rulesAndPolicies}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>

                  {profile.locationFactors.googleMapLink && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      onClick={() => window.open(profile.locationFactors.googleMapLink, '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Location Factors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Location Advantages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.locationFactors.coachingCenters.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Nearby Coaching Centers</h3>
                      <div className="space-y-2">
                        {profile.locationFactors.coachingCenters.map((center, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{center.name}</span>
                            <Badge variant="outline">{center.distance}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.locationFactors.nearbyLandmarks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Nearby Landmarks</h3>
                      <div className="space-y-2">
                        {profile.locationFactors.nearbyLandmarks.map((landmark, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{landmark.name}</span>
                            <Badge variant="outline">{landmark.distance}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Property Type</span>
                    <Badge>{getPropertyTypeLabel(profile.propertyDetails.type)}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Food Service</span>
                    <Badge variant={profile.propertyDetails.foodService.available ? "default" : "secondary"}>
                      {profile.propertyDetails.foodService.available 
                        ? getFoodTypeLabel(profile.propertyDetails.foodService.type)
                        : "Not Available"
                      }
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Facilities</span>
                    <Badge variant="outline">
                      {profile.propertyDetails.facilities.filter(f => f.available).length} Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}