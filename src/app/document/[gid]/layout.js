import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export default async function DocumentLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/')
  }

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
