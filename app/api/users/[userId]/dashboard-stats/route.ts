import { NextResponse } from "next/server";
import { Hostel } from "@/lib/mongoose/models/hostel.model";
import { Tenant } from "@/lib/mongoose/models/tenant.model";
import { RentPayment } from "@/lib/mongoose/models/rentPayment.model";
import connectDB from "@/lib/mongodb/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const { userId } = params;

    // Get all hostels for the user
    const hostels = await Hostel.find({ userId });
    const hostelIds = hostels.map(hostel => hostel._id);

    // Get all tenants across all hostels
    const tenants = await Tenant.find({ hostel: { $in: hostelIds } });
    const activeTenants = tenants.filter(tenant => tenant.status === 'active');

    // Get rent payments for the current month
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    const rentPayments = await RentPayment.find({
      hostel: { $in: hostelIds },
      month: currentMonth,
      year: currentYear
    });

    // Calculate statistics
    const totalRooms = 100; // This should be fetched from your room management system
    const occupiedRooms = activeTenants.length;
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

    const paidPayments = rentPayments.filter(payment => payment.status === 'paid');
    const pendingPayments = rentPayments.filter(payment => payment.status === 'pending').length;
    const rentCollection = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Get new tenants this month
    const newTenantsThisMonth = tenants.filter(tenant => {
      const joinDate = new Date(tenant.joinDate);
      return joinDate.getMonth() === now.getMonth() && 
             joinDate.getFullYear() === now.getFullYear();
    }).length;

    return NextResponse.json({
      totalRooms,
      occupiedRooms,
      totalTenants: tenants.length,
      rentCollection,
      occupancyRate,
      pendingPayments,
      revenueChange: 8, // This should be calculated based on historical data
      newTenantsThisMonth
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}