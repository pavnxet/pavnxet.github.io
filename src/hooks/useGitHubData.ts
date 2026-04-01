import { useState, useEffect } from "react";
import { githubData as defaultData } from "../data";

export interface GitHubStats {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  stars: number;
}

export function useGitHubData(username: string) {
  const [data, setData] = useState<GitHubStats>({
    ...defaultData,
    username,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user profile");
        const userData = await userResponse.json();

        // Fetch user repos to sum stars
        // Note: This only fetches the first 100 repos. For more, pagination is needed.
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposResponse.ok) throw new Error("Failed to fetch user repositories");
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

        setData({
          name: userData.name || userData.login,
          username: userData.login,
          avatar: userData.avatar_url,
          bio: userData.bio || "No bio available",
          followers: userData.followers,
          following: userData.following,
          public_repos: userData.public_repos,
          stars: totalStars,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  return { data, loading, error };
}
