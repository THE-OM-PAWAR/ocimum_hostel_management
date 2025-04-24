"use client";

import { motion } from "framer-motion";
import { Building2, Users, Settings, CreditCard, MessageSquare, User } from "lucide-react";

export function WorkflowSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How HostelHub works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our streamlined workflow makes hostel management simple and efficient
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

          {/* Workflow steps */}
          <div className="space-y-24 relative">
            <WorkflowStep 
              icon={<Building2 className="h-6 w-6" />}
              title="Set up your hostel layout"
              align="right"
              index={1}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="lg:col-span-3 rounded-lg border bg-card shadow-sm overflow-hidden"
                >
                  <div className="p-1 bg-muted">
                    <div className="flex items-center gap-1 px-2">
                      <div className="h-2 w-2 rounded-full bg-destructive"></div>
                      <div className="h-2 w-2 rounded-full bg-warning"></div>
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                      <div className="text-xs text-muted-foreground ml-2">Hostel Setup</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Building Name</h4>
                          <div className="h-9 rounded-md bg-muted"></div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Number of Floors</h4>
                          <div className="h-9 rounded-md bg-muted"></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Building Type</h4>
                          <div className="h-9 rounded-md bg-muted"></div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Rooms per Floor</h4>
                          <div className="h-9 rounded-md bg-muted"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Building Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {["WiFi", "Power Backup", "Security", "Laundry", "Kitchen"].map((item, i) => (
                          <div key={i} className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold">Configure your building</h3>
                  <p className="text-muted-foreground">
                    Start by setting up your hostel blocks, floors, and room types. Define room capacities, amenities, and pricing tiers.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Add multiple buildings and blocks
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Configure rooms with different features
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Set up common areas and amenities
                    </li>
                  </ul>
                </div>
              </div>
            </WorkflowStep>

            <WorkflowStep 
              icon={<Settings className="h-6 w-6" />}
              title="Configure room features"
              align="left"
              index={2}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-4 lg:order-1 order-2">
                  <h3 className="text-xl font-bold">Customize your room types</h3>
                  <p className="text-muted-foreground">
                    Define different room categories with unique amenities, pricing, and features to match your hostel offerings.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Set up single, double, or dormitory rooms
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Configure room-specific amenities
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Establish different pricing tiers
                    </li>
                  </ul>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="lg:col-span-3 rounded-lg border bg-card shadow-sm overflow-hidden lg:order-2 order-1"
                >
                  <div className="p-4">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-medium">Room Configuration</h4>
                      <div className="px-2 py-1 rounded bg-primary/10 text-xs font-medium">Editing</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {["Standard", "Deluxe", "Premium"].map((type, i) => (
                        <div key={i} className={`rounded-md border p-2 text-center text-sm ${i === 1 ? 'border-primary bg-primary/5' : ''}`}>
                          {type}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Room Type Name</label>
                        <div className="h-9 rounded-md bg-accent"></div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Capacity</label>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4].map((num) => (
                            <div key={num} className={`h-9 w-9 rounded-md flex items-center justify-center text-sm ${num === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                          {["AC", "TV", "Fridge", "WiFi", "Attached Bath", "Balcony"].map((item, i) => (
                            <div key={i} className={`px-3 py-1.5 rounded-md text-xs font-medium ${i % 2 === 0 ? 'bg-primary/10' : 'bg-accent'}`}>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Monthly Rate (₹)</label>
                        <div className="h-9 rounded-md bg-accent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </WorkflowStep>

            <WorkflowStep 
              icon={<Users className="h-6 w-6" />}
              title="Tenant onboarding"
              align="right"
              index={3}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="lg:col-span-3 rounded-lg border bg-card shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between mb-6">
                      <h4 className="font-medium">New Tenant Registration</h4>
                      <div className="flex gap-2">
                        <div className="px-2 py-1 rounded bg-muted text-xs">Step 2 of 3</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <div className="h-5 w-32 rounded bg-accent mb-1"></div>
                          <div className="h-4 w-24 rounded bg-muted"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <div className="h-9 rounded-md bg-accent"></div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <div className="h-9 rounded-md bg-accent"></div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <div className="h-9 rounded-md bg-accent"></div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ID Type</label>
                          <div className="h-9 rounded-md bg-accent"></div>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <label className="text-sm font-medium">Emergency Contact</label>
                          <div className="h-9 rounded-md bg-accent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-muted/50 flex justify-between">
                    <div className="px-4 py-2 rounded border bg-card text-sm">Back</div>
                    <div className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Continue</div>
                  </div>
                </motion.div>
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold">Simplified tenant registration</h3>
                  <p className="text-muted-foreground">
                    Streamline the tenant onboarding process with digital forms and automated workflows.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Collect tenant details digitally
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Store ID proofs and documentation
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Generate rental agreements
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Create tenant profiles with access credentials
                    </li>
                  </ul>
                </div>
              </div>
            </WorkflowStep>

            <WorkflowStep 
              icon={<CreditCard className="h-6 w-6" />}
              title="Payment collection"
              align="left"
              index={4}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-4 lg:order-1 order-2">
                  <h3 className="text-xl font-bold">Seamless rent collection</h3>
                  <p className="text-muted-foreground">
                    Automate billing cycles and provide multiple payment options for tenants to pay their rent on time.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Automated monthly invoicing
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Multiple payment methods
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Payment reminders and alerts
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Digital receipt generation
                    </li>
                  </ul>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="lg:col-span-3 rounded-lg border bg-card shadow-sm overflow-hidden lg:order-2 order-1"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-medium">Payment Portal</h4>
                      <div className="px-2 py-1 rounded bg-success/10 text-xs font-medium text-success">
                        Due in 2 days
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card/50 p-4 mb-6">
                      <div className="flex justify-between mb-1">
                        <div className="text-sm text-muted-foreground">Current Invoice</div>
                        <div className="text-sm font-medium">#INV-2025-04</div>
                      </div>
                      <div className="flex justify-between mb-4">
                        <div className="text-2xl font-bold">₹12,500</div>
                        <div className="text-sm text-muted-foreground">April 2025</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Room Rent</span>
                          <span>₹10,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Electricity</span>
                          <span>₹1,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Amenities</span>
                          <span>₹1,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="border rounded-md p-2 flex items-center justify-center bg-primary/5 border-primary">
                            <div className="text-xs">Card</div>
                          </div>
                          <div className="border rounded-md p-2 flex items-center justify-center">
                            <div className="text-xs">UPI</div>
                          </div>
                          <div className="border rounded-md p-2 flex items-center justify-center">
                            <div className="text-xs">Bank</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Pay Now</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </WorkflowStep>

            <WorkflowStep 
              icon={<MessageSquare className="h-6 w-6" />}
              title="Issue reporting"
              align="right"
              index={5}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="lg:col-span-3 rounded-lg border bg-card shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between mb-6">
                      <h4 className="font-medium">Maintenance Request</h4>
                      <div className="px-2 py-1 rounded bg-warning/10 text-xs font-medium text-warning">
                        New
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Issue Type</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {["Plumbing", "Electrical", "Furniture", "Appliance", "Other"].map((item, i) => (
                            <div key={i} className={`px-3 py-1.5 rounded-md text-xs font-medium ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <div className="h-24 rounded-md bg-accent"></div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Preferred Time for Visit</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-9 rounded-md bg-accent"></div>
                          <div className="h-9 rounded-md bg-accent"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Attach Photos</label>
                        <div className="h-16 rounded-md border border-dashed border-border bg-muted/50 flex items-center justify-center">
                          <div className="text-xs text-muted-foreground">Click or drag to upload</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-muted/50 flex justify-end">
                    <div className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm">Submit Request</div>
                  </div>
                </motion.div>
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold">Fast issue resolution</h3>
                  <p className="text-muted-foreground">
                    Provide tenants with a simple way to report maintenance issues and track their resolution status.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Digital issue submission
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Photo attachment capability
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Real-time status updates
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Maintenance staff assignment
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      Resolution history tracking
                    </li>
                  </ul>
                </div>
              </div>
            </WorkflowStep>
          </div>
        </div>
      </div>
    </section>
  );
}

interface WorkflowStepProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  align: "left" | "right";
  index: number;
}

function WorkflowStep({ icon, title, children, align, index }: WorkflowStepProps) {
  return (
    <div className="relative">
      {/* Center icon for desktop */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="h-14 w-14 rounded-full bg-background border-4 border-border flex items-center justify-center z-10">
          {icon}
        </div>
      </motion.div>
      
      {/* Step content */}
      <div className={`md:w-1/2 ${align === "right" ? "md:ml-auto pl-0 md:pl-12" : "md:mr-auto pr-0 md:pr-12"}`}>
        {/* Mobile step indicator */}
        <div className="flex items-center gap-4 mb-4 md:hidden">
          <div className="h-10 w-10 rounded-full bg-background border-2 border-border flex items-center justify-center">
            {icon}
          </div>
          <span className="text-sm font-medium text-muted-foreground">Step {index}</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: align === "right" ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          {children}
        </motion.div>
      </div>
    </div>
  );
}