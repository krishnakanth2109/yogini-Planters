import { uid } from "./store";

const PREFIX = "yp_store_";
const AUTH_USER_KEY = "yp_auth_user";

export interface Customer { id: string; name: string; email: string; phone: string; address: string; tag: "VIP" | "Repeat" | "Commercial" | "Homeowner"; joined: string; }
export interface Consultation { id: string; customer: string; type: string; date: string; status: "New" | "Scheduled" | "In Progress" | "Completed" | "Cancelled"; notes: string; }
export interface Booking { id: string; customer: string; service: string; date: string; address: string; status: "Pending" | "Approved" | "Scheduled" | "Ongoing" | "Completed" | "Cancelled"; amount: number; }
export interface Subscription { id: string; customer: string; plan: "Partial" | "Fully Customized"; plants: number; start: string; renewal: string; status: "Active" | "Paused" | "Cancelled"; }
export interface Ticket { id: string; customer: string; issue: string; status: "Open" | "Diagnosed" | "Resolved"; created: string; diagnosis?: string; }
export interface Lead { id: string; name: string; source: string; phone: string; interest: string; status: "New" | "Contacted" | "Follow-up" | "Converted" | "Lost"; }
export interface Testimonial { id: string; name: string; text: string; rating: number; approved: boolean; }
export interface GalleryItem { id: string; title: string; category: string; before: string; after: string; }
export interface Payment { id: string; customer: string; amount: number; date: string; method: string; status: "Paid" | "Pending"; invoice: string; }
export interface Notification { id: string; title: string; body: string; date: string; read: boolean; }

interface SessionUser {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: "admin" | "customer";
  tag?: Customer["tag"];
}

function getSessionUser(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function seedIfEmpty() {
  if (typeof window === "undefined") return;

  const sessionUser = getSessionUser();
  const seedOwner = sessionUser?.email || sessionUser?.role || "guest";
  const seededKey = `${PREFIX}_seeded_${seedOwner}`;
  if (sessionStorage.getItem(seededKey)) return;

  const currentCustomer = {
    name: sessionUser?.role === "customer" && sessionUser.name ? sessionUser.name : "Customer",
    email: sessionUser?.role === "customer" && sessionUser.email ? sessionUser.email : "",
    phone: sessionUser?.phone || "",
    address: sessionUser?.address || "",
    tag: sessionUser?.tag || "Homeowner",
  };

  const customers: Customer[] = [
    { id: uid(), name: currentCustomer.name, email: currentCustomer.email, phone: currentCustomer.phone, address: currentCustomer.address, tag: currentCustomer.tag, joined: "2025-08-12" },
    { id: uid(), name: "Priya Reddy", email: "priya@example.com", phone: "+91 99876 11122", address: "Jubilee Hills, Hyderabad", tag: "VIP", joined: "2025-09-04" },
    { id: uid(), name: "Karan Verma", email: "karan@example.com", phone: "+91 90000 22233", address: "Gachibowli, Hyderabad", tag: "Repeat", joined: "2025-10-21" },
    { id: uid(), name: "Cafe Mocha (Comm.)", email: "manager@cafemocha.in", phone: "+91 91234 88990", address: "Madhapur, Hyderabad", tag: "Commercial", joined: "2026-01-09" },
    { id: uid(), name: "Lakshmi Iyer", email: "lakshmi@example.com", phone: "+91 99000 11122", address: "Kondapur, Hyderabad", tag: "Homeowner", joined: "2026-02-14" },
  ];

  const consultations: Consultation[] = [
    { id: uid(), customer: currentCustomer.name, type: "Indoor styling", date: "2026-05-28", status: "Scheduled", notes: "2BHK apartment, north-facing balcony" },
    { id: uid(), customer: "Priya Reddy", type: "Balcony makeover", date: "2026-05-30", status: "New", notes: "Wants pollution-resistant plants" },
    { id: uid(), customer: "Karan Verma", type: "Plant wellness", date: "2026-05-22", status: "In Progress", notes: "Yellow leaves on money plant" },
    { id: uid(), customer: "Cafe Mocha (Comm.)", type: "Landscaping", date: "2026-06-04", status: "New", notes: "Cafe entrance + indoor zone" },
  ];

  const bookings: Booking[] = [
    { id: uid(), customer: currentCustomer.name, service: "Indoor Plant Styling", date: "2026-05-26", address: currentCustomer.address, status: "Approved", amount: 8500 },
    { id: uid(), customer: "Priya Reddy", service: "Balcony Makeover", date: "2026-05-29", address: "Jubilee Hills", status: "Scheduled", amount: 18500 },
    { id: uid(), customer: "Lakshmi Iyer", service: "Fully Customized Maintenance", date: "2026-05-24", address: "Kondapur", status: "Ongoing", amount: 4500 },
    { id: uid(), customer: "Karan Verma", service: "Plant Wellness", date: "2026-05-20", address: "Gachibowli", status: "Completed", amount: 2000 },
    { id: uid(), customer: "Cafe Mocha (Comm.)", service: "Landscaping", date: "2026-06-08", address: "Madhapur", status: "Pending", amount: 65000 },
  ];

  const subscriptions: Subscription[] = [
    { id: uid(), customer: currentCustomer.name, plan: "Partial", plants: 8, start: "2026-03-01", renewal: "2026-06-01", status: "Active" },
    { id: uid(), customer: "Lakshmi Iyer", plan: "Fully Customized", plants: 22, start: "2026-02-01", renewal: "2026-08-01", status: "Active" },
    { id: uid(), customer: "Priya Reddy", plan: "Fully Customized", plants: 15, start: "2025-12-01", renewal: "2026-06-01", status: "Paused" },
  ];

  const tickets: Ticket[] = [
    { id: uid(), customer: "Karan Verma", issue: "Money plant leaves turning yellow", status: "Diagnosed", created: "2026-05-19", diagnosis: "Overwatering; reduce frequency, repot in fresh soil." },
    { id: uid(), customer: currentCustomer.name, issue: "White spots on snake plant", status: "Open", created: "2026-05-22" },
    { id: uid(), customer: "Lakshmi Iyer", issue: "Peace lily not flowering", status: "Resolved", created: "2026-05-12", diagnosis: "Move to brighter indirect light, feed monthly." },
  ];

  const leads: Lead[] = [
    { id: uid(), name: "Rohit Mehta", source: "Instagram", phone: "+91 98000 00011", interest: "Balcony makeover", status: "New" },
    { id: uid(), name: "Neha Singh", source: "Website", phone: "+91 98000 00022", interest: "Indoor styling", status: "Contacted" },
    { id: uid(), name: "Anil Kapoor", source: "WhatsApp", phone: "+91 98000 00033", interest: "Maintenance plan", status: "Follow-up" },
    { id: uid(), name: "Shreya Das", source: "Referral", phone: "+91 98000 00044", interest: "Plant wellness", status: "Converted" },
  ];

  const testimonials: Testimonial[] = [
    { id: uid(), name: "Priya Reddy", text: "Yogini Planters completely transformed our balcony into a peaceful green space.", rating: 5, approved: true },
    { id: uid(), name: "Karan Verma", text: "The maintenance support is professional and very helpful.", rating: 5, approved: true },
    { id: uid(), name: "Cafe Mocha", text: "Their plant styling ideas added life and elegance to our interiors.", rating: 5, approved: true },
    { id: uid(), name: "Anonymous", text: "Awaiting moderation.", rating: 4, approved: false },
  ];

  const gallery: GalleryItem[] = [
    { id: uid(), title: "Banjara Hills Living Room", category: "Indoor Styling", before: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800", after: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800" },
    { id: uid(), title: "Jubilee Hills Balcony", category: "Balcony Makeover", before: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", after: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800" },
    { id: uid(), title: "Madhapur Office Lobby", category: "Commercial", before: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", after: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800" },
  ];

  const payments: Payment[] = [
    { id: uid(), customer: currentCustomer.name, amount: 8500, date: "2026-05-15", method: "UPI", status: "Paid", invoice: "INV-1001" },
    { id: uid(), customer: "Priya Reddy", amount: 18500, date: "2026-05-18", method: "Razorpay", status: "Paid", invoice: "INV-1002" },
    { id: uid(), customer: "Lakshmi Iyer", amount: 4500, date: "2026-05-20", method: "UPI", status: "Pending", invoice: "INV-1003" },
    { id: uid(), customer: "Cafe Mocha (Comm.)", amount: 65000, date: "2026-05-22", method: "Net Banking", status: "Pending", invoice: "INV-1004" },
  ];

  const notifications: Notification[] = [
    { id: uid(), title: "New booking received", body: `${currentCustomer.name} - Indoor Plant Styling`, date: "2026-05-22", read: false },
    { id: uid(), title: "Subscription renewing soon", body: "Lakshmi Iyer's plan renews on Aug 1.", date: "2026-05-21", read: false },
    { id: uid(), title: "Wellness ticket opened", body: `${currentCustomer.name} - White spots on snake plant`, date: "2026-05-22", read: true },
  ];

  const set = (k: string, v: unknown) => sessionStorage.setItem(PREFIX + k, JSON.stringify(v));
  set("customers", customers);
  set("consultations", consultations);
  set("bookings", bookings);
  set("subscriptions", subscriptions);
  set("tickets", tickets);
  set("leads", leads);
  set("testimonials", testimonials);
  set("gallery", gallery);
  set("payments", payments);
  set("notifications", notifications);
  set("settings", { businessName: "Yogini Planters", phone: "+91 88974 84114", email: "hello@yoginiplanters.in", instagram: "@yogini_planters", address: "Hyderabad, India" });

  sessionStorage.setItem(seededKey, "1");
}
