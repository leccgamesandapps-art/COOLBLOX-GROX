"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GamePlayer } from "@/components/game/GamePlayer";

export default function TestPlayPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [scene, setScene] = useState<any>(null);
  const [name, setName] = useState("Project");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.project?.sceneData) {
          setScene(data.project.sceneData);
          setName(data.project.name || "Project");
        } else setError("No scene data");
      })
      .catch(() => setError("Failed to load project"));
  }, [projectId]);

  if (error) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-surface-950 text-red-400 gap-4 p-4">
        <p>{error}</p>
        <Link href={`/studio/editor/${projectId}`} className="text-cool-400">
          Back to Editor
        </Link>
      </div>
    );
  }

  if (!scene) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-surface-950 text-slate-400">
        Loading test session...
      </div>
    );
  }

  return (
    <GamePlayer
      sceneData={scene}
      gameName={name}
      creator="You"
      projectId={projectId}
      backHref={`/studio/editor/${projectId}`}
      mode="test"
    />
  );
}
