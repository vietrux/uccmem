import { getUserById } from "@/lib/users";
import { getGravatarUrl, getGravatarProfile } from "@/lib/gravatar";
import { GravatarProfile } from "@/types/user";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  const avatarUrl = getGravatarUrl(user.email, {
    s: "200",
    d: "identicon",
    r: "pg",
  });
  let gravatarProfile: GravatarProfile | null = null;
  let aboutMe = user.aboutMe;

  if (user.email) {
    gravatarProfile = await getGravatarProfile(user.email);

    // Use Gravatar's aboutMe if user's aboutMe is empty and Gravatar has content
    if (!aboutMe && gravatarProfile?.entry?.[0]?.aboutMe) {
      aboutMe = gravatarProfile.entry[0].aboutMe;
    }
  }

  const initials = user.displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto py-4 px-4 ">
      <Button asChild variant="default" className="mb-6 border-2 border-black">
        <Link href="/">← Back to all members</Link>
      </Button>

      <Card className="max-w-4xl mx-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="md:flex">
          <div className="md:w-1/3 flex flex-col items-center p-8 border-b md:border-b-0 md:border-r-2 border-black">
            <Avatar className="w-48 h-48 border-2 border-black mb-4">
              <AvatarImage
                src={avatarUrl}
                alt={`${user.displayName}'s profile`}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2 text-center">
              {user.displayName}
            </h2>
            <Badge
              variant="default"
              className="bg-[color:var(--accent-yellow)] px-4 py-1 border border-black font-medium"
            >
              {user.job_title}
            </Badge>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 pb-1 border-b-2 border-black">
                About
              </h3>
              {aboutMe ? (
                <div className="whitespace-pre-wrap text-gray-800">
                  {aboutMe}
                </div>
              ) : (
                <p className="text-gray-500 italic">No information available</p>
              )}
            </div>

            {gravatarProfile?.entry?.[0]?.company && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 pb-1 border-b-2 border-black">
                  Company
                </h3>
                <p className="text-gray-800">
                  {gravatarProfile.entry[0].company}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold mb-3 pb-1 border-b-2 border-black">
                Contact
              </h3>
              {user.email ? (
                <Button
                  variant="default"
                  className="bg-[color:var(--accent-blue)] text-black border-2 border-black"
                  asChild
                >
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </Button>
              ) : (
                <p className="text-gray-500 italic">
                  No contact information available
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
