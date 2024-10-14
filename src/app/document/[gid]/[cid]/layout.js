import SearchBar from "@/components/ui/SearchBar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import Logo from "@/components/ui/Logo";

export default function DocumentLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
