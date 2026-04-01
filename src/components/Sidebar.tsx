import { Card, CardBody, CardHeader, Avatar, Divider, Skeleton } from "@heroui/react";
import { githubData } from "../data";
import { useGitHubData } from "../hooks/useGitHubData";
import { Github, Users, Star, BookOpen } from "lucide-react";

export function Sidebar() {
  const { data, loading } = useGitHubData(githubData.username);

  return (
    <Card className="w-full h-full p-4 bg-content1 shadow-md">
      <CardHeader className="flex flex-col items-center gap-4 pb-4">
        {loading ? (
          <Skeleton className="rounded-full w-24 h-24" />
        ) : (
          <Avatar
            src={data.avatar}
            className="w-24 h-24 text-large"
            isBordered
            color="primary"
          />
        )}
        <div className="flex flex-col items-center gap-1">
          {loading ? (
            <>
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{data.name}</h2>
              <p className="text-default-500">@{data.username}</p>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-full rounded-lg mt-2" />
        ) : (
          <p className="text-sm text-center text-default-600 px-2">
            {data.bio}
          </p>
        )}
      </CardHeader>

      <Divider />

      <CardBody className="gap-6 pt-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-md font-semibold text-default-700 uppercase">
            GitHub Analytics
          </h3>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpen size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-default-500">Public Repos</span>
              {loading ? (
                <Skeleton className="h-5 w-12 rounded-lg" />
              ) : (
                <span className="text-md font-semibold">
                  {data.public_repos}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <Users size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-default-500">
                Followers / Following
              </span>
              {loading ? (
                <Skeleton className="h-5 w-24 rounded-lg" />
              ) : (
                <span className="text-md font-semibold">
                  {data.followers} / {data.following}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <Star size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-default-500">Stars Earned</span>
              {loading ? (
                <Skeleton className="h-5 w-12 rounded-lg" />
              ) : (
                <span className="text-md font-semibold">{data.stars}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 flex justify-center">
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-default-600 hover:text-primary transition-colors"
          >
            <Github size={18} />
            View GitHub Profile
          </a>
        </div>
      </CardBody>
    </Card>
  );
}
