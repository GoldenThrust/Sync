import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Headers from "@/components/MainHeader";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);


  if (!session) {
    return redirect('/')
  }

  return (
    <html lang="en">
      <body>
        <Headers />
        {children}
      </body>
    </html>
  );
}
