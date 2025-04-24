import Link from "next/link";
import { Building2 } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container px-4 py-12 md:py-16 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="text-xl font-bold">HostelHub</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Modern hostel and PG management software that simplifies operations and enhances tenant experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="/updates" className="text-muted-foreground hover:text-foreground transition-colors">Updates</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="text-muted-foreground hover:text-foreground transition-colors">User Guides</Link></li>
                <li><Link href="/webinars" className="text-muted-foreground hover:text-foreground transition-colors">Webinars</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support Center</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/legal" className="text-muted-foreground hover:text-foreground transition-colors">Legal</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}